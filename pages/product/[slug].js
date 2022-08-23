import React from 'react'
import { contextType } from 'react-star-ratings'

export default function [slug]() {
  return (
    <div>
      
    </div>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      slug: context.params.slug
    }
  }
}
