import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import { EditorView } from "prosemirror-view";
import { EditorState, TextSelection } from "prosemirror-state";
import { DOMParser as PDOMParser, Schema, Fragment } from "prosemirror-model";
import { schema as baseSchema } from "prosemirror-schema-basic";
import { keymap } from "prosemirror-keymap";
import { exampleSetup, buildMenuItems } from "prosemirror-example-setup";
import { MenuItem } from "prosemirror-menu";
import { DOMSerializer } from "prosemirror-model";
import {
    columnResizing,
    tableEditing,
    tableNodes,
    fixTables,
    goToNextCell,
} from "prosemirror-tables";
import { tagNode, mentionNode, getMentionsPlugin } from "prosemirror-mentions";
import { defaultSettings, imagePlugin, updateImageNode } from "prosemirror-image-plugin";
import { useAuth } from "../../context/AuthContext";
import { Paperclip, Smile } from "lucide-react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
const EmojiPicker = lazy(() => import("emoji-picker-react"));




const CommentBox = ({ users, taskId }) => {

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const editorRef = useRef(null);
    const editorViewRef = useRef(null); // Track the editor instance
    const [loading, setLoading] = useState(false);
    const user = useAuth();

    useEffect(() => {
        if (!editorRef.current || editorViewRef.current) return; // Prevent duplicate instances

        const imageSettings = {
            ...defaultSettings,
            hasTitle: false,
            isBlock: false,
            uploadFile: async (file) => {
                console.log("Uploading image:", file);

                const formData = new FormData();
                formData.append("image", file);

                try {
                    const response = await fetch("http://localhost:5000/api/comments/upload-image", {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error("Failed to upload image");
                    }

                    const data = await response.json();
                    return data.file.url; // Assuming API returns { "imageUrl": "https://yourserver.com/uploads/image.png" }
                } catch (error) {
                    console.error("Image upload failed:", error);
                    return null; // Return null to prevent adding a broken image
                }
            }
        };

        let schema = new Schema({
            nodes: updateImageNode(
                baseSchema.spec.nodes
                    .append(tableNodes({ tableGroup: "block", cellContent: "block+" }))
                    .append({ mention: mentionNode })
                    .append({ tag: tagNode }),
                { ...imageSettings }
            ),
            marks: baseSchema.spec.marks,
        });

        let mentionPlugin = getMentionsPlugin({
            mentionTrigger: "@",
            hashtagTrigger: "#",
            getSuggestions: (type, text, done) => {
                setTimeout(() => {
                    if (type === "mention") {
                        done(users);
                    } else if (type === "tag") {
                        done([{ tag: "number" }, { tag: "month_name" }]);
                    }
                }, 0);
            },
        });

        let menu = buildMenuItems(schema).fullMenu;
        menu.push([new MenuItem({ label: "Add table", run: insertTable })]);

        let doc = PDOMParser.fromSchema(schema).parse(
            new DOMParser().parseFromString(`<p></p>`, "text/xml").documentElement
        );

        let state = EditorState.create({
            doc,
            plugins: [
                columnResizing(),
                tableEditing(),
                mentionPlugin,
                imagePlugin({ ...imageSettings }),
                keymap({ Tab: goToNextCell(1), "Shift-Tab": goToNextCell(-1) }),
            ].concat(exampleSetup({ schema, menuBar: false, menuContent: menu })),
        });

        let fix = fixTables(state);
        if (fix) state = state.apply(fix.setMeta("addToHistory", false));

        editorViewRef.current = new EditorView(editorRef.current, { state }); // Store the editor instance

        return () => {
            editorViewRef.current?.destroy(); // Cleanup on unmount
            editorViewRef.current = null;
        };
    }, []);

    const insertTable = (state, dispatch) => {
        const offset = state.tr.selection.anchor + 1;
        const cell = state.schema.nodes.table_cell.createAndFill();
        const node = state.schema.nodes.table.create(
            null,
            Fragment.fromArray([
                state.schema.nodes.table_row.create(null, Fragment.fromArray([cell, cell, cell])),
                state.schema.nodes.table_row.create(null, Fragment.fromArray([cell, cell, cell]))
            ])
        );

        if (dispatch) {
            dispatch(
                state.tr.replaceSelectionWith(node).scrollIntoView().setSelection(TextSelection.near(state.tr.doc.resolve(offset)))
            );
        }
        return true;
    };
    const handleSubmit = async () => {
        if (!editorViewRef.current) return;

        setLoading(true);

        // Extract content
        const doc = editorViewRef.current.state.doc;
        const serializer = DOMSerializer.fromSchema(editorViewRef.current.state.schema);
        const fragment = document.createElement("div");
        fragment.appendChild(serializer.serializeFragment(doc.content));
        const content = fragment.innerHTML.trim();

        // Check if the comment is empty
        if (!content || content === "<p></p>") {
            toast.error("Comment cannot be empty!");
            setLoading(false);
            return;
        }

        // API call
        try {
            // const response = await fetch("http://localhost:5000/api/comments/create", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.user.token}` },

            //     body: JSON.stringify({ task_id: taskId, comment: content }),
            // });
            // if (response.ok) {

            //     const newState = EditorState.create({
            //         doc: PDOMParser.fromSchema(editorViewRef.current.state.schema).parse(
            //             new DOMParser().parseFromString(`<p></p>`, "text/xml").documentElement
            //         ),
            //         plugins: editorViewRef.current.state.plugins,
            //     });

            //     editorViewRef.current.updateState(newState);
            // } else {
            //     console.error("Failed to submit comment.");
            // }

            socket.emit("comment_added", { taskId, comment: content, user_id: user.user.id });

            const newState = EditorState.create({
                doc: PDOMParser.fromSchema(editorViewRef.current.state.schema).parse(
                    new DOMParser().parseFromString(`<p></p>`, "text/xml").documentElement
                ),
                plugins: editorViewRef.current.state.plugins,
            });
        
            editorViewRef.current.updateState(newState);
            setLoading(false);
        } catch (error) {
            console.error("Error submitting comment:", error);
        }

        setLoading(false);
    };

    const handleEmojiClick = (emojiData) => {
        if (!editorViewRef.current) return;

        const { state, dispatch } = editorViewRef.current;
        const { selection } = state;
        const tr = state.tr.insertText(emojiData.emoji, selection.from, selection.to);

        dispatch(tr);
        setShowEmojiPicker(false);
    };


    return (
        <div className="sticky bottom-0 p-4 bg-white shadow-md z-50 border bordert-t-1">
            <div ref={editorRef} className="border border-gray-300 bg-white p-2 rounded-md shadow-sm"></div>
            {selectedUser && (
                <div className="mt-2 p-2 bg-blue-100 text-blue-700 rounded-md">
                    Selected User: {selectedUser}
                </div>
            )}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 p-2 bg-white rounded-lg ">
                    {/* Emoji Picker */}
                    <div className="relative">
                        <Smile
                            onClick={() => setShowEmojiPicker((prev) => !prev)}
                            className="cursor-pointer text-gray-500 hover:text-gray-700 transition-all duration-200"
                            size={20}
                        />
                        {showEmojiPicker && (
                            <div className="absolute bottom-12 left-0 bg-white shadow-lg rounded-md p-2">
                                <Suspense fallback={<div className="p-2">Loading...</div>}>
                                    <EmojiPicker
                                        onEmojiClick={handleEmojiClick}
                                        lazyLoadEmojis={true} // Improves performance
                                        disableSearchBar={true} // Remove search bar to speed up
                                        suggestedEmojisMode="none" // Hide frequent emojis
                                        defaultSkinTone={2} // Reduce variations
                                    />
                                </Suspense>
                            </div>
                        )}
                    </div>

                    {/* File Attachment */}
                    <Paperclip
                        className="cursor-pointer text-gray-500 hover:text-gray-700 transition-all duration-200"
                        size={20}
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="mt-3 px-3 py-1 bg-blue-500 text-white rounded-md"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default CommentBox;
