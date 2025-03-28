import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import { EditorView } from "prosemirror-view";
import { EditorState, TextSelection } from "prosemirror-state";
import { DOMParser as PDOMParser, Schema, Fragment } from "prosemirror-model";
import { schema as baseSchema } from "prosemirror-schema-basic";
import { keymap } from "prosemirror-keymap";
import { exampleSetup, buildMenuItems } from "prosemirror-example-setup";
import { toggleMark, setBlockType, wrapIn } from "prosemirror-commands";
import { undo, redo } from "prosemirror-history";
import { MenuItem } from "prosemirror-menu";
import { MenuView } from "prosemirror-menu"; 
import { DOMSerializer } from "prosemirror-model";
import { Plugin } from "prosemirror-state"
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
            marks: baseSchema.spec.marks.append({
                underline: {
                    parseDOM: [{ tag: "u" }, { style: "text-decoration=underline" }],
                    toDOM() { return ["u", 0]; }
                }
            }),
        });


        let mentionPlugin = getMentionsPlugin({
            mentionTrigger: "@",
            hashtagTrigger: "#",
            getSuggestions: (type, text, done) => {
                setTimeout(() => {
                    if (type === "mention") {
                        const filteredUsers = text
                            ? (Array.isArray(users) ? users.filter(u => u.name.toLowerCase().includes(text.toLowerCase())) : [])
                            : (Array.isArray(users) ? users : []);

                        const mappedUsers = filteredUsers.map(user => ({
                            name: user.name,
                            id: user.id,
                            email: user.email,
                            profile_pic: user.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                        }));

                        done(mappedUsers);

                    } else if (type === "tag") {
                        return;
                    }
                }, 0);
            },
            onEnter: (item, setEditorState, view) => {
                console.log("coming inside");
                console.log("coming inside")
                setEditorState((prevState) => {
                    let { selection } = prevState;
                    let mentionText = `@${item.name} `;

                    let tr = prevState.tr.insertText(mentionText, selection.anchor);

                    let newSelection = TextSelection.create(
                        tr.doc,
                        selection.anchor + mentionText.length
                    );
                    tr = tr.setSelection(newSelection);

                    console.log("Updated Transaction:", tr);
                    return prevState.apply(tr);
                });

                // ✅ Ensure ProseMirror editor refocuses and inserts space
                setTimeout(() => {
                    const editorNode = document.querySelector(".ProseMirror");
                    if (editorNode) {
                        editorNode.focus();
                        document.execCommand("insertText", false, " "); // Ensure space after mention
                    }
                }, 50);
            },



        });
        class MenuView {
            constructor(items, editorView) {
              this.items = items
              this.editorView = editorView
          
              this.dom = document.createElement("div")
              this.dom.className = "Prose-menubar"
              items.forEach(({dom}) => this.dom.appendChild(dom))
              this.update()
          
              this.dom.addEventListener("mousedown", e => {
                e.preventDefault()
                editorView.focus()
                items.forEach(({command, dom}) => {
                  if (dom.contains(e.target))
                    command(editorView.state, editorView.dispatch, editorView)
                })
              })
            }
          
            update() {
              this.items.forEach(({command, dom}) => {
                let active = command(this.editorView.state, null, this.editorView)
                dom.style.display = active ? "" : "none"
              })
            }
          
            destroy() { this.dom.remove() }
          }
          
        // Helper function to create menu icons
        function icon(text, name) {
            let span = document.createElement("span")
            span.className = "menuicon " + name
            span.title = name
            span.textContent = text
            return span
        }

        function menuPlugin(items) {
            return new Plugin({
                view(editorView) {
                    let menuView = new MenuView(items, editorView)
                    editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom)
                    return menuView
                }
            })
        }

        let menu = menuPlugin([
            { command: toggleMark(schema.marks.strong), dom: icon("B", "strong") }, // Bold
            { command: toggleMark(schema.marks.em), dom: icon("i", "italic") }, // Italic
            { command: toggleMark(schema.marks.underline), dom: icon("U", "underline") }, // Underline
            { command: toggleMark(schema.marks.code), dom: icon("</>", "code") }, // Code
        ]);
        
        const appendSpacePlugin = new Plugin({
            appendTransaction(transactions, oldState, newState) {
                let tr = newState.tr;
                let appended = false;
        
                transactions.forEach((transaction) => {
                    if (!transaction.docChanged) return;
        
                    // Find newly inserted mention nodes
                    transaction.mapping.maps.forEach((stepMap) => {
                        stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => {
                            let node = newState.doc.nodeAt(newStart);
                            if (node && node.type.name === "mention") {
                                tr.insertText("    ", newEnd); // Append two spaces after mention
                                appended = true;
                            }
                        });
                    });
                });
        
                return appended ? tr : null; // Return transaction only if changes were made
            }
        });
        
        let doc = PDOMParser.fromSchema(schema).parse(
            new DOMParser().parseFromString(`<p></p>`, "text/xml").documentElement
        );
        let state = EditorState.create({
            doc,
            plugins: [
                menu,
                appendSpacePlugin,
                columnResizing(),
                tableEditing(),
                mentionPlugin,
                imagePlugin({ ...imageSettings }),
                keymap({ Tab: goToNextCell(1), "Shift-Tab": goToNextCell(-1) }),
            ].concat(exampleSetup({ schema, menuBar: true, menuContent: menu })),
        });

        let fix = fixTables(state);
        if (fix) state = state.apply(fix.setMeta("addToHistory", true));

        editorViewRef.current = new EditorView(editorRef.current, { state }); // Store the editor instance

        const handleClickOutside = (event) => {
            const mentionDropdown = document.querySelector(".suggestion-item-container");
            if (mentionDropdown && !editorRef.current.contains(event.target)) {
                mentionDropdown.remove();
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            if (editorViewRef.current) {
                editorViewRef.current.destroy();
                editorViewRef.current = null;
            }

            // **Remove mention suggestion dropdown**
            const mentionDropdown = document.querySelector(".mention-suggestions");
            if (mentionDropdown) mentionDropdown.remove();
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
