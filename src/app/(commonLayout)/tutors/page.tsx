// app/(commonLayout)/tutors/page.tsx
import { TutorSearchResults } from '@/components/homePage/TutorSearchResults';
import { homePageServerService } from '@/services/homePage.service'; 

export default async function AllTutorsPage() {
  const result = await homePageServerService.browseTutors({
    page: 1,
    limit: 12,
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  return (
    <TutorSearchResults 
      initialTutors={result.success ? result.data?.tutors || [] : []}
    />
  );
}

export const metadata = {
  title: 'Find Expert Tutors | SkillBridge',
  description: 'Browse and book sessions with expert tutors',
};