import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';
import Auth from '../utils/auth';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import type { User } from '../models/User';

const SavedBooks = () => {
  // Fetch user data using Apollo's useQuery hook
  const { data, loading, error } = useQuery(GET_ME);

  // If data isn't ready, show loading state
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  if (error) {
    console.error('Error fetching user data:', error);
    return <h2>Error loading data</h2>;
  }

  const userData: User = data?.me || { savedBooks: [] };

  // Use the useMutation hook for REMOVE_BOOK
  const [removeBookMutation] = useMutation(REMOVE_BOOK);

  // Handle deleting a book using the REMOVE_BOOK mutation
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBookMutation({
        variables: { bookId },
      });

      if (data) {
        // Remove book id from localStorage after successful deletion
        removeBookId(bookId);
      }
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
