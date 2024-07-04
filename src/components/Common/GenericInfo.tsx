import styled from '@emotion/styled'


  const Info = styled.div`
  h2 {
    font-family: 'Space Mono';
    font-style: normal;
    font-weight: bold;
    font-size: 64px;
    line-height: 95px;
    letter-spacing: -0.035em;
    color: #333333; 
    margin: 0 0 36px 0;

    @media (max-width: 768px) {
      font-size: 48px;
      line-height: 71px;
      margin: 0 0 29px 0;
    }
    @media (max-width: 400px) {
      letter-spacing: -0.050em;
    }
  }

  p {
    display: block;
    width: 65%;
    font-family: 'Space Mono';
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 36px;
    letter-spacing: -0.035em;
    color: #4F4F4F;
    margin: 0 0 64px 0;

    @media (max-width: 768px) {
      width: 100%;
      padding: 0 20px 0 0;
      font-size: 18px;
      line-height: 27px;
    }
  }
`

const GenericInfo = (props:{children:any}) => {
  return ( 
      <Info>{props.children}</Info>
  );
}
 
export default GenericInfo;