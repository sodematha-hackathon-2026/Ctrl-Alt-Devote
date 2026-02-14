import { create } from 'zustand';
import { API_URL } from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Guru {
    id: number; // Backend uses Long, mapped to number
    name: string;
    nameKannada?: string;
    orderIndex: number;
    ashramaGuru?: string;
    ashramaShishya?: string;
    photoURL?: string;
    period?: string;
    startYear?: number;
    endYear?: number;
    shortHighlight?: string;
    description?: string;
    bio?: string; // mapped from description
    poorvashramaName?: string;
    aaradhane?: string;
    keyWorks?: string; // Backend sends string, we might want to split it
    vrindavanaLocation?: string;
    ashramaGuruId?: number;
    ashramaShishyaId?: number;
}

interface ParamparaState {
    gurus: Guru[];
    loading: boolean;
    error: string | null;
    selectedGuruId: number | null;

    setGurus: (gurus: Guru[]) => void;
    fetchGurus: () => Promise<void>;
    selectGuru: (id: number) => void;
}

export const useParamparaStore = create<ParamparaState>()(
    persist(
        (set, get) => ({
            gurus: [],
            loading: false,
            error: null,
            selectedGuruId: null,

            setGurus: (gurus) => set({ gurus }),

            fetchGurus: async () => {
                set({ loading: true, error: null });
                try {
                    console.log('[PARAMPARA] Fetching gurus from:', `${API_URL}/content/guru`);
                    const response = await fetch(`${API_URL}/content/guru`);
                    console.log('[PARAMPARA] Response status:', response.status);

                    if (!response.ok) throw new Error('Failed to fetch gurus');
                    const data = await response.json();
                    console.log('[PARAMPARA] Received data:', data.length, 'gurus');

                    // Client-side mapping if backend doesn't align perfectly yet
                    const mappedGurus = data.map((g: any) => ({
                        ...g,
                        bio: g.description, // Map description to bio
                    }));

                    // Sort by orderIndex just in case
                    mappedGurus.sort((a: Guru, b: Guru) => a.orderIndex - b.orderIndex);
                    console.log('[PARAMPARA] Mapped and sorted gurus:', mappedGurus.length);

                    set({ gurus: mappedGurus, loading: false });
                } catch (error: any) {
                    console.error('[PARAMPARA] Error fetching gurus:', error);
                    set({ error: error.message, loading: false });
                }
            },

            selectGuru: (id) => set({ selectedGuruId: id }),
        }),
        {
            name: 'parampara-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
