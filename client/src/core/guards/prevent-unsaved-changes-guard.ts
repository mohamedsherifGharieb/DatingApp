import { CanDeactivateFn } from '@angular/router';
import { Member } from '../../Types/member';
import { MemberProfile } from '../../featurs/members/member-profile/member-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component, currentRoute, currentState, nextState) => {
if(component.editForm?.dirty){
  return confirm("are u sure you want to continue ? all unsaved changes will be lost")
}
return true;

};
