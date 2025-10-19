import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Profile = () => {
    const { user } = useContext(UserContext);
    if (!user) return;
    return (
        <div>
            <div className="landing d-flex align-items-center justify-content-center motion">
                <img className='w-50 img-animation' src="/assets/Images/profile.webp" alt="" />
                <div>
                    <h1 className='display-3 txt3 fw-semibold'>Hello <span className="txt4 txt-shadow">{user.username} !</span></h1>
                    <p className="display-6 txt2">
                        {
                            user.hasDigitalCard ?
                                `Welcome back! Access and share your digital card anytime with your unique `
                                :
                                `Build your digital card easily and share it smarter with your own `
                        }
                        <span className="txt4 fw-bold">QR code</span>.
                    </p>
                    {
                        user.hasDigitalCard ?
                            <div className="d-flex gap-3">
                                <Link to={"/manage-card"} style={{ width: "fit-content", borderStyle: "dotted", borderWidth: "2px", }} className='btn btn-outline-primary align-self-center px-5 py-1 rounded-pill mt-3 fs-3 border-dotted fit-content-width'>
                                    Manage Card
                                </Link>

                                <Link to={`/card?username=${user.username}&udc=${user.userID}`} style={{ width: "fit-content", borderStyle: "dotted", borderWidth: "2px", }} className='btn btn-primary align-self-center px-5 py-1 rounded-pill mt-3 fs-3 border-dotted fit-content-width'>
                                    Access Card
                                </Link>
                            </div>
                            :
                            <>
                                <Link to={"/create-card"} style={{ width: "fit-content", borderStyle: "dotted", borderWidth: "2px", }} className='btn btn-outline-primary align-self-center px-5 py-1 rounded-pill mt-3 fs-3 border-dotted fit-content-width'>
                                    Start Now
                                </Link>
                            </>
                    }
                </div>
            </div>
        </div>
    );
}

export default Profile;