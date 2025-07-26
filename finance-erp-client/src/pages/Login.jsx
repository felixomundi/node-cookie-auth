import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { useState } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("omundifelix30@gmail.com");
  const [password, setPassword] = useState("Nyagaka@2030?");
  const { error, loading } = useSelector((state) => state.auth);
  const handleLogin = async (e) => {
    e.preventDefault();
    // await dispatch(login({ email, password }));
    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      console.log("Login success");
    } else {
      console.error("Login failed:", result.payload);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
