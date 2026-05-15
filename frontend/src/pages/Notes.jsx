// src/pages/Notes.jsx
import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaLink, FaPaperclip, FaImage, FaFilePdf, FaTrash } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

function Notes() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Add new note
  const addNote = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    try {
      const formData = new FormData();
      // Auto-generate title from first 20 chars
      const title = text.length > 20 ? text.substring(0, 20) + "..." : (text || "Untitled Note");

      formData.append("title", title);
      formData.append("content", text);
      if (link) formData.append("link", link);
      if (file) formData.append("file", file);

      const res = await api.post("/notes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNotes([res.data, ...notes]);
      setText("");
      setLink("");
      setFile(null);
      setShowLinkInput(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading notes...</p>;

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-gray-700">My Notes</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium">{user?.name}</span>
          <button
            onClick={logout}
            className="neumorphic-btn px-6 py-2 text-red-500 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="neumorphic p-6 mb-10 relative" style={{ backgroundColor: '#e1f5fe' }}>
        <form onSubmit={addNote} className="flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a new note..."
            className="w-full neumorphic-inset px-6 py-4 focus:outline-none text-gray-700 min-h-[100px] resize-none rounded-lg"
          />

          {/* Action Bar */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              {/* Link Toggle */}
              <button
                type="button"
                onClick={() => setShowLinkInput(!showLinkInput)}
                className={`p-3 rounded-full transition-all ${showLinkInput ? 'neumorphic-inset text-blue-500' : 'neumorphic-btn text-gray-500 hover:text-blue-500'}`}
                title="Add Link"
              >
                <FaLink size={18} />
              </button>

              {/* File Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className={`p-3 rounded-full transition-all ${file ? 'neumorphic-inset text-green-500' : 'neumorphic-btn text-gray-500 hover:text-green-500'}`}
                title="Upload Image/PDF"
              >
                {file ? (file.type.includes('pdf') ? <FaFilePdf size={18} /> : <FaImage size={18} />) : <FaPaperclip size={18} />}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="hidden"
              />
            </div>

            <button
              type="submit"
              className="neumorphic-btn px-6 py-2 text-blue-600 font-bold flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <span>Add Note</span>
              <IoMdSend />
            </button>
          </div>

          {/* Conditional Inputs Preview */}
          {(showLinkInput || link) && (
            <div className="mt-2 flex items-center gap-2 animate-fade-in px-2">
              <FaLink className="text-blue-400" />
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste your link here..."
                className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-400 focus:outline-none py-1 text-sm text-gray-600"
                autoFocus
              />
              {link && (
                <button type="button" onClick={() => setLink("")} className="text-gray-400 hover:text-red-400">
                  <FaTrash size={12} />
                </button>
              )}
            </div>
          )}

          {file && (
            <div className="mt-2 flex items-center gap-2 px-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-md w-fit">
              {file.type.includes('pdf') ? <FaFilePdf className="text-red-500" /> : <FaImage className="text-blue-500" />}
              <span className="truncate max-w-[200px]">{file.name}</span>
              <button type="button" onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="ml-2 text-gray-400 hover:text-red-500">
                <FaTrash size={12} />
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No notes yet. Start by adding one above!
          </div>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="neumorphic p-6 flex flex-col justify-between min-h-[150px]" style={{ backgroundColor: '#fff3e0' }}>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">{note.title}</h3>
                <p className="text-gray-600 mb-4 whitespace-pre-wrap break-words">{note.content}</p>
                {note.link && (
                  <a
                    href={note.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-500 hover:underline text-sm break-all mb-4 bg-blue-50 p-2 rounded-md w-fit max-w-full"
                  >
                    <FaLink size={12} className="flex-shrink-0" />
                    <span className="truncate">{note.link}</span>
                  </a>
                )}
                {/* File Display with Guard */}
                {note.file && (
                  <div className="mb-4">
                    {note.file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                      <img
                        src={`http://localhost:5000/${note.file}`}
                        alt="Attachment"
                        className="w-full h-48 object-cover rounded-lg neumorphic-inset"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=Error+Loading+Image' }}
                      />
                    ) : (
                      <a
                        href={`http://localhost:5000/${note.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 bg-red-50 p-3 rounded-lg w-fit transition-colors"
                      >
                        <FaFilePdf size={20} />
                        <span className="font-medium text-sm">View PDF Attachment</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={() => deleteNote(note._id)}
                  className="neumorphic-btn p-2 rounded-full text-red-400 hover:text-red-600 transition-colors"
                  title="Delete Note"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
