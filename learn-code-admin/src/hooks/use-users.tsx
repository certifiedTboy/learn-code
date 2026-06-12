import { useState, useEffect } from "react";
import { useGetAllRegisteredUsersMutation } from "../lib/apis/user-apis";
import { isAtLeast31DaysAgo } from "../helpers/course";

type UserRow = {
  id: string;
  name: string;
  email: string;
  registeredCourses: number;
  isSubscribed: boolean;
  joinedDate: string;
  isActive: boolean;
};

let cachedUsers: UserRow[] | null = null;

export const useUsers = () => {
  const [users, setUsers] = useState<UserRow[]>(cachedUsers || []);
  const [getAllRegisteredUsers, { data, isSuccess }] =
    useGetAllRegisteredUsersMutation();

  useEffect(() => {
    if (!cachedUsers) {
      getAllRegisteredUsers(null);
    }
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      const newUsers = data.data.map((user: any) => ({
        id: user._id,
        name:
          user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.email,
        email: user.email,
        registeredCourses: user?.registeredCourses?.length || 0,
        isSubscribed: user?.registeredCourses?.find((course: any) =>
          isAtLeast31DaysAgo(course?.dateRegistered),
        )
          ? true
          : false,
        joinedDate: user?.createdAt,
        isActive: true,
      }));

      cachedUsers = newUsers;
      setUsers(newUsers);
    }
  }, [data, isSuccess]);

  return { users };
};
