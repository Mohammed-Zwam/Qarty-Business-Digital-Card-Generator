import { useContext } from 'react';
import { Result } from 'antd';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
const NotFound = () => {
    const { user } = useContext(UserContext);
    console.log(user)
    return (
        <div>
            <Result
                status="404"
                title={<h1 className='display-3 txt4 fw-bold'>404</h1>}
                subTitle={<h1 className='fs-2 txt3'>Sorry, the page you visited does not exist.</h1>}
                extra={<Link to={'/'} className='btn btn-outline-primary align-self-center px-4 py-1 rounded-pill mt-3 fs-5 border-dotted fit-content-width'>Back Home</Link>}
            />
        </div>
    )
}

export default NotFound;