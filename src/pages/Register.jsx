import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // ESTO ESTÁ BIEN
import { db } from "../firebase"; // importa Firestore
import { doc, setDoc } from "firebase/firestore"; // importa funciones para guardar

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 AQUÍ está corregido

  const handleRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      // Crear el usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar información adicional en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date()
      });

      alert("Registro exitoso!");

      navigate("/login"); // 👈 AQUÍ está corregido
    } catch (err) {
      console.error("Error registrando usuario:", err);
      setError(err.message); // Mostrar el error si algo sale mal
    }
  };

  return (
    <div className="register-container">
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
