import apiClient from '../api/apiClient';

/**
 * Maps the backend workstation object to the frontend format.
 */
export const mapWorkstationFromApi = (apiWorkstation) => ({
  id: apiWorkstation.id,
  title: apiWorkstation.title,
  description: apiWorkstation.description,
  content: apiWorkstation.content,
  owner: apiWorkstation.owner,
  ownerName: apiWorkstation.owner_name,
  ownerEmail: apiWorkstation.owner_email,
  visibility: apiWorkstation.visibility,
  template: apiWorkstation.template,
  members: apiWorkstation.members.map(member => ({
    id: member.id,
    user: member.user,
    email: member.user_email,
    name: member.user_name,
    role: member.role,
    joinedAt: member.joined_at
  })),
  memberCount: apiWorkstation.member_count,
  createdAt: apiWorkstation.created_at,
  updatedAt: apiWorkstation.updated_at
});

export const fetchWorkstations = async () => {
  const response = await apiClient.get('workstations/');
  return response.data.map(mapWorkstationFromApi);
};

export const fetchWorkstationDetail = async (id) => {
  const response = await apiClient.get(`workstations/${id}/`);
  return mapWorkstationFromApi(response.data);
};

export const createWorkstation = async (data) => {
  const response = await apiClient.post('workstations/', data);
  return mapWorkstationFromApi(response.data);
};

export const updateWorkstation = async (id, data) => {
  const response = await apiClient.put(`workstations/${id}/`, data);
  return mapWorkstationFromApi(response.data);
};

export const searchUsers = async (query) => {
  const response = await apiClient.get('workstations/search-users/', {
    params: { q: query }
  });
  return response.data;
};

export const fetchInvites = async () => {
  const response = await apiClient.get('workstations/invites/');
  return response.data;
};

export const sendInvite = async (workstationId, inviteeId, role = 'EDITOR') => {
  const response = await apiClient.post('workstations/invites/', {
    workstation: workstationId,
    invitee: inviteeId,
    role
  });
  return response.data;
};

export const respondToInvite = async (inviteId, action) => {
  const response = await apiClient.post(`workstations/invites/${inviteId}/respond/`, {
    action // 'ACCEPT' or 'REJECT'
  });
  return response.data;
};

export const exportWorkstation = async (workstationId, format = 'pdf') => {
  // Use window.location origin to build the full URL if needed, 
  // but better to use apiClient's base URL and handle blob response
  const response = await apiClient.get(`workstations/${workstationId}/export/`, {
    params: { format },
    responseType: 'blob'
  });
  
  // Trigger download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `workstation_${workstationId}.${format}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
export const deleteWorkstation = async (id) => {
  const response = await apiClient.delete(`workstations/${id}/`);
  return response.data;
};
