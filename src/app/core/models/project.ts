import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from '@angular/fire/firestore';

export interface Project {
  id?: string;
  programmerId: string;
  authorName?: string;
  name: string;                
  description: string;
  projectType: 'Académico' | 'Profesional' | ''; 
  role: string;                
  technologies: string;        
  repoUrl?: string;            
  demoUrl?: string;            
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private firestore = inject(Firestore);

  addProject(project: Project) {
    const ref = collection(this.firestore, 'projects');
    return addDoc(ref, project);
  }

  async getMyProjects(uid: string) {
    const ref = collection(this.firestore, 'projects');
    const q = query(ref, where('programmerId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({id: doc.id, ...doc.data() as any}));
  }

  deleteProject(id: string) {
    const ref = doc(this.firestore, `projects/${id}`);
    return deleteDoc(ref);
  }

  async getAllProjects() {
    const ref = collection(this.firestore, 'projects');
    const snap = await getDocs(ref);
    return snap.docs.map(doc => ({id: doc.id, ...doc.data() as any}));
  }

  
}