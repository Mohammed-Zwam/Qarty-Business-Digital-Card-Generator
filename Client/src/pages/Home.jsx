import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-page">
            <div className="landing mt-5 d-flex justify-content-around align-items-center motion">
                <img className='w-50 img-animation' src="/assets/Images/home.webp" alt="" />
                <div className='d-flex flex-column'>
                    <h1 className='display-1 txt2 fw-medium txt-shadow' >
                        Go
                        <span className='txt4'> Digital</span>.
                    </h1>
                    <h1 className='display-1 txt2 fw-medium txt-shadow'>
                        Share
                        <span className='txt4'> Smarter</span>.
                    </h1>
                    <Link to="/login" style={{ width: "fit-content", borderStyle: "dotted", borderWidth: "2px", }} className='btn btn-outline-primary  px-5 py-1 rounded-pill mt-3 fs-3 border-dotted fit-content-width'>Get Started</Link>
                </div>
            </div>
        </div>
    );
}

export default Home;