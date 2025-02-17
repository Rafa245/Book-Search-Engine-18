import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client'; // Import useMutation from Apollo
import { LOGIN_USER } from '../utils/mutations'; // Import the LOGIN_USER mutation
import Auth from '../utils/auth';
import type { User } from '../models/User';

const LoginForm = ({}: { handleModalClose: () => void }) => {
  const [userFormData, setUserFormData] = useState<User>({
    username: '',
    email: '',
    password: '',
    savedBooks: [],
  });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Apollo mutation hook
  const [loginUser] = useMutation(LOGIN_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await loginUser({
        variables: { email: userFormData.email, password: userFormData.password }, // Pass email and password as variables
      });

      const { token } = data.loginUser; // Assuming the mutation returns a `token`

      if (!token) {
        throw new Error('something went wrong!');
      }

      Auth.login(token); // Log the user in with the returned token
    } catch (err) {
      console.error(err);
      setShowAlert(true); // Show alert if there is an error
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
      savedBooks: [],
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email || ''}
            required
          />
          <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password || ''}
            required
          />
          <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          variant="success">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
