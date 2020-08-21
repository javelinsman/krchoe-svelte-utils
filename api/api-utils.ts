import axios, { AxiosPromise } from "axios";

export function getCookie(name: string): string {
    let cookieValue = '';
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// export async function ensure_csrf_cookie() {
//   const csrftoken = getCookie('csrftoken')
//   if (!csrftoken.length) {
//     return await axios.get(
//       fromBaseUrl('auth_ajax/set_csrf_cookie'),
//       { withCredentials: true }
//     )
//   }
// }

interface Prop {
  url: string
  data?: any
  option?: any
}

export async function GET<T>({ url, option }: Prop) {
  const request: AxiosPromise<T>
    = axios.get(url,
      {
        // withCredentials: true,
        ...option
      }
    )
  return (await request).data
}

export async function POST<T>({ url, data, option }: Prop) {
  // await ensure_csrf_cookie()
  // const csrftoken = getCookie('csrftoken')
  const request: AxiosPromise<T>
    = axios.post(url, data,
      {
        // withCredentials: true,
        // headers: {
        //   'X-CSRFToken': csrftoken
        // },
        ...option
      }
    )
  return (await request).data
}

export async function PUT<T>({ url, data, option }: Prop) {
  // await ensure_csrf_cookie()
  // const csrftoken = getCookie('csrftoken')
  const request: AxiosPromise<T>
    = axios.put(url, data,
      {
        // withCredentials: true,
        // headers: {
        //   'X-CSRFToken': csrftoken
        // },
        ...option
      }
    )

  return (await request).data
}
export async function DELETE<T>({ url, option }: Prop) {
  // await ensure_csrf_cookie()
  const csrftoken = getCookie('csrftoken')
  const request: AxiosPromise<T>
    = axios.delete(url,
      {
        // withCredentials: true,
        // headers: {
        //   'X-CSRFToken': csrftoken
        // },
        ...option
      }
    )
  return (await request).data
}