import { z } from 'zod';

export const organizationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().nullable().optional(),
});

export const emptyOrganization = {
  id: '',
  name: '',
  description: null,
};
