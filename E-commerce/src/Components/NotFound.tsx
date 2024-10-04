import { Link, useNavigate } from "react-router-dom";

function NotFound(){
    const navigate = useNavigate();

    setTimeout(() => {
        navigate('/');
    }, 4000)

    return (
        <div>
            <h2>404 - Not Found</h2>
            <img src="NoGo.jpg" alt="Not Found" height="300" />
            <p>Going home in 5...</p>
            <p><Link to="/">Go Home!</Link></p>
        </div>
    );

}

export default NotFound;