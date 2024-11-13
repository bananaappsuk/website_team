import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import deleteIcon from "../../assets/Quiz/Vector.png";
import searchIcon from "../../assets/Quiz/Group 1.png";
import { Timestamp } from 'firebase/firestore';

interface Library {
    _id: string;
    keyLearningPoint: string;
    action: string;
    Library: boolean;
    Learn: boolean;
    createdAt: Timestamp;
}

const Libraries = () => {
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [filteredLibraries, setFilteredLibraries] = useState<Library[]>([]);
    const [currentLibraryIndex, setCurrentLibraryIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchLibraries = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/libraries`);
                if (!response.ok) {
                    throw new Error('Failed to fetch Libraries');
                }
                const data = await response.json();
                console.log('Fetched Libraries:', data);
                setLibraries(data);
                setFilteredLibraries(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Libraries:', error);
                setError((error as Error).message);
                setLoading(false);
            }
        };
        fetchLibraries();
    }, []);

    useEffect(() => {
        const filtered = libraries.filter((library) =>
            library.keyLearningPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
            library.action.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredLibraries(filtered);
        setCurrentLibraryIndex(0);
    }, [searchTerm, libraries]);

    const handleDeleteLibrary = async (libraryId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/libraries/${libraryId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete Library');
            }

            const updatedLibraries = libraries.filter((library) => library._id !== libraryId);
            setLibraries(updatedLibraries);
            setFilteredLibraries(updatedLibraries);

            if (currentLibraryIndex >= updatedLibraries.length) {
                setCurrentLibraryIndex(updatedLibraries.length - 1);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error deleting Library:', error);
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading Libraries...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (libraries.length === 0) {
        return <div>No Libraries available</div>;
    }

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="w-full flex justify-center items-center">
                <div className="relative w-[90%]">
                    <input
                        type="text"
                        placeholder="Search key words"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-2 rounded-md text-center px-3 pl-12 py-1 bg-gray-100 w-full"
                    />
                    <Image
                        src={searchIcon}
                        alt="Search Icon"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    />
                </div>
            </div>
            {searchTerm && (
                <div className="mt-4 flex justify-center font-bold">
                    <span className="w-48">Total Libraries (Filtered):</span>
                    <input
                        className="w-12 border-2 text-center border-gray-300 rounded-md"
                        value={filteredLibraries.length}
                        readOnly
                    />
                </div>
            )}

            <main className="mt-8">
                {filteredLibraries.map((library) => (
                    <div key={library._id} className="">
                        <div className="h-[1px] w-full bg-gray-300" />
                        <div className="flex justify-between my-2">
                            <div className="flex-1 bg-white rounded-md p-4">
                                <p className="font-bold text-black">Key Learning Points:</p>
                                <p className="text-black">{library.keyLearningPoint}</p>
                                <p className="font-bold text-black mt-4">Action:</p>
                                <p className="text-black">{library.action}</p>
                            </div>

                            <div className="flex flex-col items-center justify-center ml-4 p-4">
                                <p className='ml-auto'>
                                    [
                                    {
                                        library?.createdAt instanceof Timestamp
                                            ? library?.createdAt.toDate().toLocaleDateString()
                                            : new Date(library?.createdAt).toLocaleDateString()
                                    }
                                    ]
                                </p>
                                <div className="relative group">
                                    <button
                                        className="p-2"
                                        onClick={() => handleDeleteLibrary(library._id)}
                                    >
                                        <Image src={deleteIcon} alt="Delete" className="h-6 w-6" />
                                    </button>
                                    <span className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Delete Library
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[1px] w-full bg-gray-300" />
                    </div>
                ))}
            </main>



        </div>
    );
};

export default Libraries;
