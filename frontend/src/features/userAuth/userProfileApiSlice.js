import { userApi } from "../../services/api/userApi";

export const userProfileApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
    showProfile: builder.query({
      query: (id) => `/profile/${id}`,
      transformResponse: (response) => response.user,
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/profile/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useShowProfileQuery,
  useUpdateProfileMutation,
} = userProfileApiSlice;