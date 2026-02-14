import { Swamiji } from '../data/guruParampara';

export interface TimelineEvent {
    year: string;
    description: string;
}

export interface TimelineSection {
    title: string;
    era: string;
    events: TimelineEvent[];
    gurus: Swamiji[];
}

// Approximate mapping based on orderIndex typically aligning with succession
// This is a heuristic since we don't have precise dates for everyone in a machine-readable format yet.
// Sri Madhvacharya (1238-1317) is the start.
// Vadiraja Teertha (1480-1600) is around index 20.
// Vishwavallabha Teertha (current) is index 36.

const ERAS = [
    { title: "The Beginning", start: 0, end: 5, era: "13th - 14th Century", events: [{ year: "1238", description: "Birth of Sri Madhvacharya" }, { year: "1336", description: "Founding of Vijayanagara Empire" }] },
    { title: "Early Peetadhipathis", start: 6, end: 15, era: "14th - 15th Century", events: [{ year: "1424", description: "Devaraya II Reign" }] },
    { title: "The Vadiraja Era", start: 16, end: 21, era: "16th Century", events: [{ year: "1565", description: "Battle of Talikota" }, { year: "1509", description: "Coronation of Krishnadevaraya" }] },
    { title: "Post-Vadiraja Period", start: 22, end: 28, era: "17th - 18th Century", events: [{ year: "1674", description: "Coronation of Chhatrapati Shivaji" }] },
    { title: "Modern Era", start: 29, end: 35, era: "19th - 20th Century", events: [{ year: "1947", description: "Indian Independence" }] },
    { title: "Current Period", start: 36, end: 100, era: "21st Century", events: [{ year: "2010", description: "Paryaya of Sri Vishwavallabha Teertha" }] }
];

export const groupGurusByTimeline = (gurus: Swamiji[]): TimelineSection[] => {
    // Sort gurus by orderIndex first
    const sortedGurus = [...gurus].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    return ERAS.map(era => {
        const eraGurus = sortedGurus.filter(g => {
            const index = g.orderIndex || 0;
            return index >= era.start && index <= era.end;
        });

        return {
            title: era.title,
            era: era.era,
            events: era.events,
            gurus: eraGurus
        };
    }).filter(section => section.gurus.length > 0);
};
