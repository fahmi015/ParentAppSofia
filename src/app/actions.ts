'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = 'https://api.sofia-sahara.com/api/v1';

// --- Auth ---

export async function loginAction(prevState: any, formData: FormData) {
    const cin = formData.get('cin') as string;
    const password = formData.get('password') as string;
    const firebaseToken = 'web_placeholder_token';

    try {
        const response = await axios.post(`${API_URL}/auth/guardian`, {
            cin,
            password,
            firebase_token: firebaseToken,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (response.status === 200) {
            const data = response.data;
            const cookieStore = await cookies();
            cookieStore.set('token', data.token, { secure: true, httpOnly: false });
            cookieStore.set('user', JSON.stringify(data.user), { secure: true, httpOnly: false });

            return { success: true, data: data };
        }
    } catch (error: any) {
        console.error('Login Action Error:', error.response?.data || error.message);

        if (error.response) {
            if (error.response.status === 404) {
                return { success: false, message: 'المستخدم غير موجود. تأكد من رقم الهوية.' };
            }
            if (error.response.status === 401) {
                return { success: false, message: 'كلمة المرور غير صحيحة.' };
            }
            return { success: false, message: error.response.data?.message || 'فشل تسجيل الدخول' };
        }
        return { success: false, message: 'حدث خطأ في الاتصال' };
    }

    return { success: false, message: 'Unknown error' };
}

// --- Data Fetching Helpers ---

async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
}

// --- Publications (Activities / Devoir) ---

export async function getPublications() {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/guardian/publications?include=groups`, { headers });
        return { success: true, data: response.data.data };
    } catch (error: any) {
        console.error('Get Publications Error:', error.message);
        return { success: false, data: [] };
    }
}

// --- Students ---

export async function getStudents() {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/guardian/students`, { headers });
        return { success: true, data: response.data.data };
    } catch (error: any) {
        console.error('Get Students Error:', error.message);
        return { success: false, data: [] };
    }
}

// --- Extra Activities (Annual Program) ---

export async function getExtraActivities() {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/guardian/extracurricular_activities`, { headers });
        return { success: true, data: response.data.data };
    } catch (error: any) {
        console.error('Get Extra Activities Error:', error.message);
        return { success: false, data: [] };
    }
}

// --- Time Slots (Groups/Sessions) ---

export async function getStudentGroups(studentId: number) {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/guardian/groups?filter[students.id]=${studentId}&include=sessions,sessions.subject`, { headers });
        if (response.data.data && response.data.data.length > 0) {
            return { success: true, data: response.data.data[0].sessions };
        }
        return { success: true, data: [] };
    } catch (error: any) {
        console.error('Get Student Groups Error:', error.message);
        return { success: false, data: [] };
    }
}

// --- Absences ---

export async function getStudentAbsences(studentId: number) {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/guardian/attendance_records?filter[student_id]=${studentId}`, { headers });
        return { success: true, data: response.data.data };
    } catch (error: any) {
        console.error('Get Student Absences Error:', error.message);
        return { success: false, data: [] };
    }
}

// --- Points (Notes) ---

export async function getStudentNotes(studentId: number, examNumber: number) {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/guardian/notes?filter[student_id]=${studentId}&filter[exam_number]=${examNumber}`, { headers });
        return { success: true, data: response.data.data };
    } catch (error: any) {
        console.error('Get Student Notes Error:', error.message);
        return { success: false, data: [] };
    }
}

export async function getStudentFinalExam(studentId: number, semester: number) {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/guardian/notes/summery?student_id=${studentId}&semester=${semester}`, { headers });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Get Student Final Exam Error:', error.message);
        return { success: false, data: null };
    }
}

// --- Report (Statistics) ---

export async function getStudentStatistics(studentId: number, semester: number) {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/guardian/statistiques/notes?student_id=${studentId}&semester=${semester}`, { headers });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Get Student Statistics Error:', error.message);
        return { success: false, data: [] };
    }
}

// --- Invoices ---

export async function getInvoices() {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/guardian/invoices`, { headers });
        return { success: true, data: response.data.data };
    } catch (error: any) {
        console.error('Get Invoices Error:', error.message);
        return { success: false, data: [] };
    }
}

// --- Profile ---

export async function updatePassword(data: any) {
    const cookieStore = await cookies();
    const userStr = cookieStore.get('user')?.value;
    if (!userStr) return { success: false, message: 'User not found' };
    const user = JSON.parse(userStr);

    try {
        const headers = await getAuthHeaders();
        const response = await axios.put(`${API_URL}/guardian/guardians/${user.id}/update-password`, data, { headers });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Update Password Error:', error.message);
        return { success: false, message: error.response?.data?.message || 'Failed to update password' };
    }
}

export async function updateAvatar(base64Image: string) {
    const cookieStore = await cookies();
    const userStr = cookieStore.get('user')?.value;
    if (!userStr) return { success: false, message: 'User not found' };
    const user = JSON.parse(userStr);

    try {
        const headers = await getAuthHeaders();
        const response = await axios.put(`${API_URL}/guardian/guardians/${user.id}/update-avatar`, { avatar: base64Image }, { headers });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Update Avatar Error:', error.message);
        return { success: false, message: error.response?.data?.message || 'Failed to update avatar' };
    }
}

// --- Messages ---

export async function getMessages(type: 'receive' | 'send') {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/guardian/messages?filter[guardian_messages]=${type}`, { headers });
        return { success: true, data: response.data.data };
    } catch (error: any) {
        console.error('Get Messages Error:', error.message);
        return { success: false, data: [] };
    }
}

export async function getMessageRecipients() {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/guardian/users`, { headers });
        return { success: true, data: response.data.data };
    } catch (error: any) {
        console.error('Get Message Recipients Error:', error.message);
        return { success: false, data: [] };
    }
}

export async function sendMessage(data: any) {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.post(`${API_URL}/guardian/messages`, data, { headers });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Send Message Error:', error.message);
        return { success: false, message: error.response?.data?.message || 'Failed to send message' };
    }
}
