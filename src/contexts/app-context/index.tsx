"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { AppState, AppAction } from "./types"

const initialState: AppState = {
  user: null,
  groups: [],
  summaries: [],
  preferences: {
    summaryTypes: {
      weeklyDigest: false,
      missedMessages: false,
      topicBased: false,
    },
    schedule: {
      frequency: "weekly",
      time: "09:00",
    },
    keywords: [],
  },
  distributionChannels: [],
  notifications: [],
  isLoading: false,
  error: null,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }
    case "SET_GROUPS":
      return { ...state, groups: action.payload }
    case "SET_SUMMARIES":
      return { ...state, summaries: action.payload }
    case "UPDATE_PREFERENCES":
      return { ...state, preferences: { ...state.preferences, ...action.payload } }
    case "ADD_DISTRIBUTION_CHANNEL":
      return {
        ...state,
        distributionChannels: [...state.distributionChannels, action.payload],
      }
    case "SET_DISTRIBUTION_CHANNELS":
      return { ...state, distributionChannels: action.payload }
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
