import styled from '@emotion/styled'

const Wrapper = styled.header`

`
const Title = styled.h1`
  font-family: 'Inconsolata', monospace;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 25px;
  letter-spacing: -0.08em;
  text-transform: uppercase;
  margin: 0;
  `

const GenericTitle = (props:{children:any}) => {
  return ( 
    <Wrapper>
      <Title>{props.children}</Title>
    </Wrapper>
  );
}
 
export default GenericTitle;