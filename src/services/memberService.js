import axiosInstance from "../api/axiosInstance";

export const getMembers = async () => {
  const response = await axiosInstance.get("/api/Members");
  return response.data;
};

export const getMemberById = async (id) => {
  const response = await axiosInstance.get(`/api/Members/${id}`);
  return response.data;
};

export const createMember = async (memberData) => {
  const response = await axiosInstance.post(
    "/api/Members",
    memberData
  );

  return response.data;
};

export const updateMember = async ({
  id,
  memberData,
}) => {
  const response = await axiosInstance.put(
    `/api/Members/${id}`,
    memberData
  );

  return response.data;
};

export const deleteMember = async (id) => {
  const response = await axiosInstance.delete(
    `/api/Members/${id}`
  );

  return response.data;
};