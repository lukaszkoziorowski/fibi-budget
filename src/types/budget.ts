export interface Category {
  id: string;
  name: string;
  budget: number;
  groupId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryGroup {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isCollapsed?: boolean;
} 
 
 
 
 
 
 