import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.css';
import './style.css'
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify'
import { register, reset } from "../../Slice/authSlice";
import Spinner from "../../components/Spinner";

function SignUpForm() {
    const [state, setState] = useState({
        first_name:"",
        last_name:"",
        username: "",
        email: "",
        password: "",
        re_password: "",
    });
    const [gender, setGender] = useState('');
    const [errorShown, setErrorShown] = useState(false);

  const { first_name, last_name, username, email, password, re_password } = state;
  
  const navigate = useNavigate();  
  const  dispatch = useDispatch();

  const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

  useEffect(() => {
    if(isError){
        toast.error(message)
        console.log('signup-',message)
    }
    if (isSuccess) {
      
      toast.success("An activation email has been sent to your email. Please check your email")
      navigate('/login')
    }
    dispatch(reset())
  }, [user, isError, isSuccess, message])

  const handleChange = evt => {
    const value = evt.target.value;
    if (value === '' || (/^[A-Za-z]/.test(value) && !/^\s/.test(value))) {
    setState({
      ...state,
      [evt.target.name]: value
    });
    setErrorShown(false);
    }else{
      if (!errorShown) {
        toast.error("Value should start with an alphabet and should not have leading spaces", { toastId: 'errorMessage' });
        setErrorShown(true);
      }
    }
  };
  const handleGenderChange = (evt) => {
    setGender(evt.target.value);
  };


  const handleOnSubmit = evt => {
    evt.preventDefault();

    if(password!=re_password){
        toast.error('Passwords do not match')
    }else{
        const userData = {
            first_name, 
            last_name, 
            username,
            email,
            password,
            re_password,
            gender
        }
        dispatch(register(userData))
        
    }
  };

  return (

    <div className="App">
      <h2>Connect You</h2>
      <div className='container right-panel-active' id="container">

      <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        {/* <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <span>or use your email for registration</span> */}
        <div style={{display:"flex"}}>
        <input
            style={{marginRight:"5px"}}
          type="text"
          name="first_name"
          value={state.first_name}
          onChange={handleChange}
          placeholder="Firstname"
          required
        />
                <input
          type="text"
          name="last_name"
          value={state.last_name}
          onChange={handleChange}
          placeholder="Lastname"
          required
        />

        </div>
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="password"
          name="re_password"
          value={state.re_password}
          onChange={handleChange}
          placeholder="Confirm"
          required
        />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <label htmlFor="gender" style={{ marginRight: '10px' }}>Gender:</label>
              <select
                name="gender"
                value={gender}
                onChange={handleGenderChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                }}
              >
                <option value="">Select </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
        <button>Sign Up</button>
        {isLoading && <Spinner/>}
      </form>
    </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default SignUpForm;
