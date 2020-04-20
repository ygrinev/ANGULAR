import {User} from './User';
import {CustomMap} from './Map';
import { Company } from './Company';

const customMap = new CustomMap('map');
// console.log(new User().name);
// console.log(new Company());
// customMap.addUserMarker(new User());
// customMap.addCompanyMarker(new Company());
customMap.addMarker(new User());
customMap.addMarker(new Company());
