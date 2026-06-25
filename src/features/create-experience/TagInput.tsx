import { X } from "lucide-react"

type TagInputProps = {
  readonly draft: string
  readonly tags: readonly string[]
  readonly onDraftChange: (value: string) => void
  readonly onAddTag: () => void
  readonly onRemoveTag: (tag: string) => void
}

export function TagInput({ draft, tags, onDraftChange, onAddTag, onRemoveTag }: TagInputProps) {
  return (
    <label className="tag-editor">
      <span>태그</span>
      <input
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return
          event.preventDefault()
          onAddTag()
        }}
        placeholder="태그를 입력하고 Enter"
      />
      {tags.length === 0 ? null : (
        <div className="tag-chip-list">
          {tags.map((tag) => (
            <button type="button" className="tag-chip" key={tag} onClick={() => onRemoveTag(tag)}>
              {tag}
              <X aria-hidden="true" size={13} />
            </button>
          ))}
        </div>
      )}
    </label>
  )
}
