import styled from '@emotion/styled';
import ImageNotFound from '../../assets/404.png'
import GenericTitle from './GenericTitle';
import GenericInfo from './GenericInfo';
import GenericButton from './GenericButton';
import { Link } from 'react-router-dom';
const Main = styled.main`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 120px;
  margin: 64px 0;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    grid-gap: 60px;
  }
`;



const Image = styled.img`
  display: block;
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
`



const NotFound = () => {
  return (
    <>
<GenericTitle>404 Not Found</GenericTitle>

    <Main>

      <div>
        <Image src={ImageNotFound} alt=""/>
      </div>
      <GenericInfo>
        <p>The page you are looking for might be removed or is temporarily unavailable</p>
        <Link to="/"><GenericButton>Back to Home</GenericButton>
        </Link>
      </GenericInfo>
    </Main>
    </>
    
  );
}

  export default NotFound;