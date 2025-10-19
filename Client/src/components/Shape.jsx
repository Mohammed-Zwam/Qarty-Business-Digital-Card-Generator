import "../styles/Shape.css";

const Shape = ({ classes }) => {
    return (
        <div className={`shape-container ${classes}`}>
            <div className="shape"></div>
        </div>
    );
}

export default Shape;