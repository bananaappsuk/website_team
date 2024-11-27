import SavedQuizzes from '@/components/SavedQuizzes'
import React from 'react'

type UserData = {
  uid: string;
  email: string;
  userName: string;
  jobRole: string;
  profilePicUrl: string | undefined;
};

type Props = {
  userData: UserData | null;
};

const Saved: React.FC<Props> = ({ userData }) => {
  return (
    <div>
     { userData && <SavedQuizzes currentUserData={userData} />}
    </div>
  );
};

export default Saved