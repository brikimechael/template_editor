import { Reader } from '@usewaypoint/email-builder';
import CONFIGURATION from './EmailConfiguration';


const  EntrepriseEmailEditor = () => {
    return (<Reader document={CONFIGURATION} rootBlockId="root" />)
}
export default EntrepriseEmailEditor;
