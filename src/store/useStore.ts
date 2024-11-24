import { create } from 'zustand'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  Timestamp,
  setDoc,
  getDoc
} from 'firebase/firestore'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  AuthError,
  User as FirebaseUser
} from 'firebase/auth'
import { db, auth } from '@/lib/firebase'
import { Shift, User, Workplace, UserPreferences } from '../types'

interface Store {
  user: User | null
  preferences: UserPreferences
  shifts: Shift[]
  workplaces: Workplace[]
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
  updateUserProfile: (data: { name?: string }) => Promise<void>
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>
  fetchShifts: (userId: string) => Promise<void>
  fetchWorkplaces: (userId: string) => Promise<void>
  fetchPreferences: (userId: string) => Promise<void>
  addShift: (shift: Omit<Shift, 'id'>) => Promise<void>
  updateShift: (shiftId: string, shift: Partial<Shift>) => Promise<void>
  deleteShift: (shiftId: string) => Promise<void>
  addWorkplace: (workplace: Omit<Workplace, 'id' | 'userId'>) => Promise<void>
  updateWorkplace: (workplaceId: string, workplace: Partial<Workplace>) => Promise<void>
  deleteWorkplace: (workplaceId: string) => Promise<void>
  resendVerificationEmail: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const defaultPreferences: UserPreferences = {
  currency: 'USD',
  timezone: 'UTC',
  defaultView: 'dashboard'
}

export const useStore = create<Store>((set, get) => {
  // Set up auth state listener
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      if (!firebaseUser.emailVerified) {
        set({ user: null, shifts: [], workplaces: [], preferences: defaultPreferences })
        return
      }

      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || '',
        emailVerified: firebaseUser.emailVerified
      }
      set({ user })
      
      // Fetch user data
      const { fetchShifts, fetchWorkplaces, fetchPreferences } = get()
      await fetchShifts(user.id)
      await fetchWorkplaces(user.id)
      await fetchPreferences(user.id)
    } else {
      set({ user: null, shifts: [], workplaces: [], preferences: defaultPreferences })
    }
  })

  return {
    user: null,
    preferences: defaultPreferences,
    shifts: [],
    workplaces: [],
    loading: false,
    error: null,

    setUser: (user) => set({ user }),

    signUp: async (email: string, password: string, name: string) => {
      try {
        set({ loading: true, error: null })
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCredential.user, { displayName: name })
        await sendEmailVerification(userCredential.user)
        
        const preferencesRef = doc(db, 'preferences', userCredential.user.uid)
        await setDoc(preferencesRef, defaultPreferences)

        set({ user: null, loading: false, error: null }) // Set user to null until email is verified
      } catch (error) {
        const authError = error as AuthError
        set({ error: authError.code, loading: false })
        throw error
      }
    },

    signIn: async (email: string, password: string) => {
      try {
        set({ loading: true, error: null })
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        if (!userCredential.user.emailVerified) {
          set({ user: null, loading: false, error: 'auth/email-not-verified' })
          throw new Error('Please verify your email before signing in')
        }
        set({ loading: false, error: null })
      } catch (error) {
        const authError = error as AuthError
        set({ error: authError.code, loading: false })
        throw error
      }
    },

    signOut: async () => {
      try {
        set({ loading: true, error: null })
        await firebaseSignOut(auth)
        set({ user: null, shifts: [], workplaces: [], preferences: defaultPreferences, loading: false, error: null })
      } catch (error) {
        const authError = error as AuthError
        set({ error: authError.code, loading: false })
        throw error
      }
    },

    updateUserProfile: async (data: { name?: string }) => {
      try {
        set({ loading: true, error: null })
        const currentUser = auth.currentUser
        if (!currentUser) throw new Error('No authenticated user')

        if (data.name) {
          await updateProfile(currentUser, { displayName: data.name })
          set(state => ({
            user: state.user ? { ...state.user, name: data.name! } : null,
            loading: false,
            error: null
          }))
        }
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
        throw error
      }
    },

    updateUserPassword: async (currentPassword: string, newPassword: string) => {
      try {
        set({ loading: true, error: null })
        const currentUser = auth.currentUser
        if (!currentUser || !currentUser.email) throw new Error('No authenticated user')

        await signInWithEmailAndPassword(auth, currentUser.email, currentPassword)
        await updatePassword(currentUser, newPassword)
        set({ loading: false, error: null })
      } catch (error) {
        const authError = error as AuthError
        set({ error: authError.code, loading: false })
        throw error
      }
    },

    resendVerificationEmail: async () => {
      try {
        set({ loading: true, error: null })
        const currentUser = auth.currentUser
        if (!currentUser) throw new Error('No authenticated user')
        await sendEmailVerification(currentUser)
        set({ loading: false, error: null })
      } catch (error) {
        const authError = error as AuthError
        set({ error: authError.code, loading: false })
        throw error
      }
    },

    resetPassword: async (email: string) => {
      try {
        set({ loading: true, error: null })
        await sendPasswordResetEmail(auth, email)
        set({ loading: false, error: null })
      } catch (error) {
        const authError = error as AuthError
        set({ error: authError.code, loading: false })
        throw error
      }
    },

    fetchShifts: async (userId: string) => {
      try {
        set({ loading: true, error: null })
        const shiftsRef = collection(db, 'shifts')
        const q = query(shiftsRef, where('userId', '==', userId))
        const querySnapshot = await getDocs(q)
        
        const shifts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        })) as Shift[]

        set({ shifts, loading: false, error: null })
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
        throw error
      }
    },

    fetchWorkplaces: async (userId: string) => {
      try {
        set({ loading: true, error: null })
        const workplacesRef = collection(db, 'workplaces')
        const q = query(workplacesRef, where('userId', '==', userId))
        const querySnapshot = await getDocs(q)
        
        const workplaces = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Workplace[]

        set({ workplaces, loading: false, error: null })
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
        throw error
      }
    },

    fetchPreferences: async (userId: string) => {
      try {
        set({ loading: true, error: null })
        const preferencesRef = doc(db, 'preferences', userId)
        const preferencesSnap = await getDoc(preferencesRef)
        
        if (preferencesSnap.exists()) {
          const preferences = preferencesSnap.data() as UserPreferences
          set({ preferences, loading: false, error: null })
        } else {
          set({ preferences: defaultPreferences, loading: false, error: null })
        }
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
        throw error
      }
    },

    updatePreferences: async (preferences: Partial<UserPreferences>) => {
      try {
        set({ loading: true, error: null })
        const { user } = get()
        if (!user) throw new Error('No authenticated user')

        const preferencesRef = doc(db, 'preferences', user.id)
        const currentPreferences = get().preferences
        const updatedPreferences = { ...currentPreferences, ...preferences }
        
        await setDoc(preferencesRef, updatedPreferences)
        set({ preferences: updatedPreferences, loading: false, error: null })
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
        throw error
      }
    },

    addShift: async (shift: Omit<Shift, 'id'>) => {
      try {
        set({ loading: true, error: null })
        const shiftWithDate = {
          ...shift,
          date: Timestamp.fromDate(new Date(shift.date))
        }

        const docRef = await addDoc(collection(db, 'shifts'), shiftWithDate)
        const newShift = {
          id: docRef.id,
          ...shift,
        }

        set(state => ({
          shifts: [...state.shifts, newShift],
          loading: false,
          error: null
        }))
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
        throw error
      }
    },

    updateShift: async (shiftId: string, shiftUpdate: Partial<Shift>) => {
      try {
        set({ loading: true, error: null })
        const shiftRef = doc(db, 'shifts', shiftId)
        
        if (shiftUpdate.date) {
          shiftUpdate.date = Timestamp.fromDate(new Date(shiftUpdate.date)) as any
        }
        
        await updateDoc(shiftRef, shiftUpdate)

        set(state => ({
          shifts: state.shifts.map(shift => 
            shift.id === shiftId ? { ...shift, ...shiftUpdate } : shift
          ),
          loading: false,
          error: null
        }))
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
        throw error
      }
    },

    deleteShift: async (shiftId: string) => {
      try {
        set({ loading: true, error: null })
        await deleteDoc(doc(db, 'shifts', shiftId))

        set(state => ({
          shifts: state.shifts.filter(shift => shift.id !== shiftId),
          loading: false,
          error: null
        }))
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
        throw error
      }
    },

    addWorkplace: async (workplace: Omit<Workplace, 'id' | 'userId'>) => {
      try {
        set({ loading: true, error: null })
        const { user } = get()
        if (!user) throw new Error('No authenticated user')

        const workplaceWithUser = {
          ...workplace,
          userId: user.id
        }

        const docRef = await addDoc(collection(db, 'workplaces'), workplaceWithUser)
        const newWorkplace = {
          id: docRef.id,
          ...workplaceWithUser
        }

        set(state => ({
          workplaces: [...state.workplaces, newWorkplace],
          loading: false,
          error: null
        }))
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
        throw error
      }
    },

    updateWorkplace: async (workplaceId: string, workplaceUpdate: Partial<Workplace>) => {
      try {
        set({ loading: true, error: null })
        const workplaceRef = doc(db, 'workplaces', workplaceId)
        await updateDoc(workplaceRef, workplaceUpdate)

        set(state => ({
          workplaces: state.workplaces.map(workplace => 
            workplace.id === workplaceId ? { ...workplace, ...workplaceUpdate } : workplace
          ),
          loading: false,
          error: null
        }))
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
        throw error
      }
    },

    deleteWorkplace: async (workplaceId: string) => {
      try {
        set({ loading: true, error: null })
        await deleteDoc(doc(db, 'workplaces', workplaceId))

        set(state => ({
          workplaces: state.workplaces.filter(workplace => workplace.id !== workplaceId),
          loading: false,
          error: null
        }))
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
        throw error
      }
    }
  }
})