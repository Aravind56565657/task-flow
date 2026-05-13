import { firestoreService } from '../firebase/services';
import { Project, Task } from '../types';

export const seedDatabase = async (userId: string) => {
  try {
    // Create Sample Projects
    const project1Id = await firestoreService.createDocument('projects', {
      name: 'TaskFlow Pro Launch',
      description: 'Main project for the SaaS launch of TaskFlow Pro.',
      status: 'active',
      priority: 'high',
      ownerId: userId,
      members: [userId],
    });

    const project2Id = await firestoreService.createDocument('projects', {
      name: 'Marketing Campaign',
      description: 'Q3 Social media and paid search campaign.',
      status: 'active',
      priority: 'medium',
      ownerId: userId,
      members: [userId],
    });

    if (project1Id) {
      // Create Sample Tasks for Project 1
      await firestoreService.createDocument('tasks', {
        projectId: project1Id,
        ownerId: userId,
        title: 'Design landing page mockup',
        description: 'Create high-fidelity designs for the homepage.',
        status: 'done',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
        assignedTo: userId,
        createdBy: userId,
      });

      await firestoreService.createDocument('tasks', {
        projectId: project1Id,
        ownerId: userId,
        title: 'Implement Firebase Auth',
        description: 'Set up login and registration flows.',
        status: 'in-progress',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 86400000), // 1 day from now
        assignedTo: userId,
        createdBy: userId,
      });

      await firestoreService.createDocument('tasks', {
        projectId: project1Id,
        ownerId: userId,
        title: 'Beta testing phase',
        description: 'Invite first 50 users to test the platform.',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 7), // 1 week from now
        assignedTo: null,
        createdBy: userId,
      });
    }

    if (project2Id) {
       await firestoreService.createDocument('tasks', {
        projectId: project2Id,
        ownerId: userId,
        title: 'Set up Google Ads',
        description: 'Configure initial ad groups and keywords.',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 3),
        assignedTo: userId,
        createdBy: userId,
      });
    }

    // Create Activity Log
    await firestoreService.createDocument('activity_logs', {
      userId,
      projectId: project1Id,
      action: 'Seeded sample data for the initial setup.',
      timestamp: new Date(),
    });

    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};
