import { Link } from "react-router-dom";

const PoweredByComponent = () => {
    return (
        <div className="d-flex align-items-center justify-content-center flex-column mt-3">
            <h2 className="txt3 display-3 fw-medium">POWERED BY</h2>
            <Link to={'/'} className='text-decoration-none'>
                <h1 className='platform-logo display-4 fw-bold'>Qarty</h1>
            </Link>
        </div>
    );
}

export default PoweredByComponent;