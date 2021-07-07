const SubmissionBox = (i, index) => {
  return (
    <div className='submission' key={index}>
      {i.submissionName}
    </div>
  )
}

export default SubmissionBox
