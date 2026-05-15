import  { Link }  from "react-router-dom";

function ErrorMessage({ message }) {
    return (
        <div className="error-message">
            <p>{message}</p>
            
            <Link to="/" state={{ scrollPosition: window.scrollY }} >Torna alla HomePage</Link>
            
        </div>
    );
}
export default ErrorMessage;