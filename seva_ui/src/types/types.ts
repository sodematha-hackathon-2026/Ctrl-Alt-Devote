// User types
export interface User {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: 'USER' | 'VOLUNTEER' | 'ADMIN';
    isVolunteer: boolean;
    volunteerRequest?: boolean;
    createdAt: string;
}

export interface PaginatedUsers {
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

// Content types
export interface NewsArticle {
    id?: number;
    title: string;
    content: string;
    imageURL?: string;
    isPublished: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Event {
    id?: number;
    title: string;
    date: string;
    tithi?: string;
    description?: string;
    category?: string;
    imageURL?: string;
    createdAt?: string;
}

export interface Branch {
    id?: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    mapLink?: string;
    latitude?: number;
    longitude?: number;
}

export interface Guru {
    id?: number;
    name: string;
    nameKannada?: string;
    orderIndex: number;
    ashramaGuru?: string;
    ashramaShishya?: string;
    photoURL?: string;
    period?: string;
    poorvashramaName?: string;
    aaradhane?: string;
    peetarohana?: string;
    keyWorks?: string;
    description?: string;
    vrindavanaLocation?: string;
    vrindavanaMapLink?: string;
    isBhootarajaru?: boolean;
}

export interface FlashUpdate {
    id?: number;
    message: string;
    link?: string;
    isActive: boolean;
    expiryDate?: string;
    createdAt?: string;
}

export interface Timings {
    id: number;
    location: string;
    darshanTime?: string;
    prasadaTime?: string;
    isActive: boolean;
}

export interface Album {
    id?: number;
    title: string;
    description?: string;
    coverImage?: string;
    createdAt?: string;
}

export interface MediaItem {
    id?: number;
    album?: Album;
    url: string;
    type: 'IMAGE' | 'VIDEO';
    caption?: string;
    orderIndex?: number;
}

export interface DailyAlankara {
    id: string;
    imageUrl: string;
    uploadedAt: string;
}

// Analytics types
export interface DashboardStats {
    totalUsers: number;
    totalSevaBookings: number;
    totalRevenue: number;
    activeEvents: number;
    [key: string]: any;
}

export interface SevaStats {
    [date: string]: number;
}

export interface RevenueStats {
    [date: string]: number;
}

export interface VolunteerOpportunity {
    id: string;
    title: string;
    description: string;
    requiredSkills: string;
    imageUrl?: string;
    applicationCount: number;
    status: 'OPEN' | 'CLOSED';
    createdAt: string;
}

export interface VolunteerApplication {
    id: string;
    user: User;
    opportunity: VolunteerOpportunity;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    appliedAt: string;
}

export interface VolunteerRequest {
    userId: string;
    name: string;
    phoneNumber: string;
    email: string;
    hobbiesOrTalents: string;
    pastExperience: string;
}

export interface Seva {
    id: number;
    titleEnglish: string;
    titleKannada: string;
    descriptionEnglish: string;
    descriptionKannada: string;
    amount: number;
    category: string;
    isActive: boolean;
}

export interface SevaBooking {
    id: string; // UUID
    seva: Seva;
    devoteeName: string;
    sevaDate: string;
    status: string;
    amountPaid: number;
    paymentStatus: string;
}

export interface RoomBooking {
    id: string; // UUID
    roomType?: string; // Not in backend entity yet? Check later.
    userId: string; // phone number
    userName?: string; // user's full name
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    numberOfRooms: number;
    status: string;
}
