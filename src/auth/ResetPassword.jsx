import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

const ResetPassword = () => {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extraction de l'email à partir des query params
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Gestion de la visibilité du mot de passe
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    console.log("Token:", token);
    console.log("Email:", email);
  }, [token, email]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation des mots de passe
    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.post("/password-reset-confirm/", {
        token,
        new_password: password,
      });

      Swal.fire({
        title: "Succès",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "OK",
        timer: 5000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || "Une erreur est survenue.";
      setError(errorMessage);

      Swal.fire({
        title: "Erreur",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-img">
      <div className="content">
        <header>Réinitialiser le mot de passe</header>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <span className="fa fa-lock"></span>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="show" onClick={togglePasswordVisibility}>
              <i className={`fa ${passwordVisible ? "fa-eye" : "fa-eye-slash"}`}></i>
            </span>
          </div>

          <div className="field space">
            <span className="fa fa-lock"></span>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            <span className="show" onClick={togglePasswordVisibility}>
              <i className={`fa ${passwordVisible ? "fa-eye" : "fa-eye-slash"}`}></i>
            </span>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="field">
            {loading ? (
              <ClipLoader color="#36d7b7" size={35} />
            ) : (
              <input type="submit" value="RÉINITIALISER" />
            )}
          </div>
        </form>

        <div className="signup">
          Vous avez un compte ? <Link to="/login">Connectez-vous maintenant</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
