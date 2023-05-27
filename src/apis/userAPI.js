// 导入封装 axios 对象
import request from '@/utils/request.js'

/**
 * 修改用户信息 API
 * @param userData
 * @returns
 */
export const updateUserDataAPI = async userData => {
  return request.put(`/apis/user/account/profile`, {
    userData
  })
}

/**
 * 修改用户密码 API
 * @param password
 * @param newPassword
 * @returns
 */
export const updateUserPasswordAPI = async (password, newPassword) => {
  return request.put('/apis/user/account/password', {
    password,
    newPassword
  })
}

/**
 * 验证占用电话 API
 * @param phone
 * @returns
 */
export const verifyPhoneAPI = async phone => {
  return request.get('/apis/user/verify/phone', {
    params: { phone }
  })
}

/**
 * 验证占用邮箱 API
 * @param email
 * @returns
 */
export const verifyEmailAPI = async email => {
  return request.get('/apis/user/verify/email', {
    params: { email }
  })
}

/**
 * 无感刷新 API
 * @returns
 */
export const refreshTokenAPI = async () => {
  return request.get('/apis/user/refresh_token').then(async ({ data: { AccessToken } }) => {
    await localStorage.setItem('Access-Token', AccessToken)
  })
}
