import { Dispatch } from 'redux';
import {
  UserDetailsActionTypes,
  UserLoginActionTypes,
  UserPayload,
  UserRegisterActionTypes,
  UserUpdateProfileActionTypes
} from '../reducers/userReducers';
import { USER_ACTIONS } from '../types';
import store from '../store';
import axios, { AxiosResponse } from 'axios';

export const login = (email: string, password: string) => async (
  dispatch: Dispatch<UserLoginActionTypes>
) => {
  try {
    dispatch({
      type: USER_ACTIONS.USER_LOGIN_REQUEST
    });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.post<any, AxiosResponse<UserPayload>>(
      '/api/user/login',
      { email, password },
      config
    );

    const data = response.data;
    console.log(response);
    dispatch({
      type: USER_ACTIONS.USER_LOGIN_SUCCESS,
      payload: data
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_ACTIONS.USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const logout = () => (dispatch: Dispatch<UserLoginActionTypes>) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_ACTIONS.USER_LOGOUT });
};

export const register = (name: string, email: string, password: string) => async (
  dispatch: Dispatch<UserRegisterActionTypes | UserLoginActionTypes>
) => {
  try {
    dispatch({
      type: USER_ACTIONS.USER_REGISTER_REQUEST
    });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post<any, AxiosResponse<UserPayload>>(
      '/api/user/register',
      { name, email, password },
      config
    );
    dispatch({
      type: USER_ACTIONS.USER_REGISTER_SUCCESS,
      payload: data
    });

    dispatch({
      type: USER_ACTIONS.USER_LOGIN_SUCCESS,
      payload: data
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_ACTIONS.USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const getUserDetails = (id: string) => async (
  dispatch: Dispatch<UserDetailsActionTypes>,
  getState: typeof store.getState
) => {
  try {
    dispatch({
      type: USER_ACTIONS.USER_DETAILS_REQUEST
    });
    const {
      userLogin: { userInfo }
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`
      }
    };

    const { data } = await axios.get<any, AxiosResponse<UserPayload>>(
      `/api/user/${id}`,
      config
    );
    dispatch({
      type: USER_ACTIONS.USER_DETAILS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: USER_ACTIONS.USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};
export interface UserUpdateProfilePayload {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export const updateUserDetails = (user: UserUpdateProfilePayload) => async (
  dispatch: Dispatch<UserUpdateProfileActionTypes>,
  getState: typeof store.getState
) => {
  try {
    dispatch({
      type: USER_ACTIONS.USER_UPDATE_PROFILE_REQUEST
    });
    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`
      }
    };

    const { data } = await axios.put<any, AxiosResponse<UserPayload>>(
      `/api/user/profile`,
      user,
      config
    );
    dispatch({
      type: USER_ACTIONS.USER_UPDATE_PROFILE_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: USER_ACTIONS.USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};