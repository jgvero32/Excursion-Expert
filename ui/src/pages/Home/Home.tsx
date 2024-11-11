import './Home.scss';

export function Home() {
  return (
    <>
      <div className="mountain-image">
        <img src="/mountain-image.jpg" alt="Glacier Mountains" />
        <div className="inner-box">
          <div className="welcome-inner-box">
          <h1 className="welcome-text">Welcome.</h1>
          <h1 className="welcome-text">Create a perfect plan.</h1>
          <h1 className="welcome-text">Seek, explore, discover.</h1>
            <div className="buttons">
              <a href="/login" className="login-button">Login</a>
              <a href="/register" className="register-button">Register</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}