export type AppRole = 'ADMIN' | 'EDITOR';
export type AppStatus = 'ACTIVE' | 'INACTIVE';

export type AdminSession = {
  user: {
    id: string;
    email: string;
    name: string;
    role: AppRole;
  };
};

export type ProfileRow = {
  id: string;
  name: string;
  role: AppRole;
  status: AppStatus;
  created_at?: string;
  updated_at?: string;
};
