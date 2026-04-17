import React, { useEffect, useState } from "react";
import axios from "axios";

const PERSON_API = "http://127.0.0.1:8000/api/persons/";
const HISTORY_API = "http://127.0.0.1:8000/api/ai-history/";

function App() {
  const [persons, setPersons] = useState([]);
  const [history, setHistory] = useState([]);
  const [editId, setEditId] = useState(null);
  const [description, setDescription] = useState("");
  const [aiAction, setAiAction] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    place: "",
    image: null,
  });

  useEffect(() => {
    fetchPersons();
    fetchHistory();
  }, []);

  const fetchPersons = async () => {
    const res = await axios.get(PERSON_API);
    setPersons(res.data);
  };

  const fetchHistory = async () => {
    const res = await axios.get(HISTORY_API);
    setHistory(res.data);
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("age", formData.age);
    data.append("place", formData.place);
    data.append("description", description);
    if (formData.image) data.append("image", formData.image);

    if (editId) {
      await axios.put(PERSON_API + editId + "/", data);
      setEditId(null);
    } else {
      await axios.post(PERSON_API, data);
    }

    setFormData({ name: "", age: "", place: "", image: null });
    setDescription("");
    fetchPersons();
  };

  const handleEdit = (person) => {
    setFormData({
      name: person.name,
      age: person.age,
      place: person.place,
      image: null,
    });
    setEditId(person.id);
    setDescription(person.description || "");
  };

  const handleDelete = async (id) => {
    await axios.delete(PERSON_API + id + "/");
    fetchPersons();
  };

  // AI Bio Generator
  const generateDescription = async () => {
    const res = await axios.post(
      "http://127.0.0.1:8000/generate-description/",
      {
        name: formData.name,
        age: formData.age,
        place: formData.place,
      }
    );
    setDescription(res.data.description);
  };

  // AI Action Generator
  const generateAIAction = async () => {
    const res = await axios.post(
      "http://127.0.0.1:8000/generate-ai-action/",
      {
        name: formData.name,
      }
    );
    setAiAction(res.data.action);
    fetchHistory();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Powered Person Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          name="place"
          placeholder="Place"
          value={formData.place}
          onChange={handleChange}
          required
        />
        <input type="file" name="image" onChange={handleChange} />

        <br /><br />

        <button type="button" onClick={generateDescription}>
          Generate Bio (AI)
        </button>

        <button type="button" onClick={generateAIAction}>
          Generate AI Action
        </button>

        <br /><br />

        <textarea
          placeholder="AI Generated Bio"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          cols="50"
        />

        <br /><br />

        <textarea
          placeholder="AI Generated Action"
          value={aiAction}
          readOnly
          rows="3"
          cols="50"
        />

        <br /><br />

        <button type="submit">
          {editId ? "Update" : "Add"} Person
        </button>
      </form>

      <hr />

      <h3>Person List</h3>
      {persons.map((person) => (
        <div key={person.id}>
          <p>
            <b>{person.name}</b> | {person.age} | {person.place}
          </p>
          <p>{person.description}</p>
          <img src={person.image} alt="" width="100" />
          <br />
          <button onClick={() => handleEdit(person)}>Edit</button>
          <button onClick={() => handleDelete(person.id)}>Delete</button>
          <hr />
        </div>
      ))}

      <hr />

      <h3>AI Action History</h3>
      {history.map((item) => (
        <div key={item.id}>
          <b>{item.name}</b>: {item.action}
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;