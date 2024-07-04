import { HashLoader
} from "react-spinners";




function GenericSpinner(props:{loading:boolean}){
return(
<HashLoader
loading={props.loading}
aria-label="Loading Spinner"
style={{  position: "absolute", height: "100px",
    width: "100px",
    top: "50%",
    left: "50%",
    marginLeft: "-50px",
    marginTop: "-50px"
   }}
/> 
)
}
export default GenericSpinner;