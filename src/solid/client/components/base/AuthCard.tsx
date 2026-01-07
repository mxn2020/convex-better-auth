// src/solid/client/components/base/AuthCard.tsx

import type { Component, JSX } from 'solid-js'
import { Show } from 'solid-js'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tanstack-app/ui/solid'

export interface AuthCardProps {
  title: string
  description?: string
  children: JSX.Element
  footer?: JSX.Element
}

export const AuthCard: Component<AuthCardProps> = (props) => {
  return (
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle class="text-lg md:text-xl">{props.title}</CardTitle>
        <Show when={props.description}>
          <CardDescription class="text-xs md:text-sm">
            {props.description}
          </CardDescription>
        </Show>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
      <Show when={props.footer}>
        <CardFooter>{props.footer}</CardFooter>
      </Show>
    </Card>
  )
}
