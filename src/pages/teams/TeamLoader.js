import React from 'react';

const TeamLoader = () => {
    return (
        <div className="p-6 space-y-4 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="flex flex-col">
                    <div className="h-4 w-24 bg-gray-300 animate-pulse rounded"></div>
                    <div className="h-3 w-48 bg-gray-300 animate-pulse rounded mt-1"></div>
                </div>
            </div>

            <div className='flex items-start justify-between'>
                <div className='' style={{ width: "90%" }}>
                    <div className="text-lg font-semibold">Curated work</div>
                    <div className="space-y-2">
                        <div className="h-8 w-[90%] bg-gray-300 animate-pulse rounded"></div>
                        <div className="h-8 w-[90%] bg-gray-300 animate-pulse rounded"></div>
                    </div>
                </div>

                {/* Members Section */}
                <div>
                    <div className="text-lg font-semibold">Members</div>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                        {[...Array(8)].map((_, index) => (
                            <div
                                key={index}
                                className="h-10 w-10 rounded-full bg-gray-300 animate-pulse flex items-center justify-center"
                            ></div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TeamLoader;