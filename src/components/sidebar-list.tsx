import { getProjects, shareProject, removeProject } from '@/app/actions/projects'
import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'

export interface SidebarListProps {
  userId?: string
}

export async function SidebarList({ userId }: SidebarListProps) {
  if (!userId) {
    return
  }
  const projects = await getProjects(userId)
  return (
    <div className="flex-1 overflow-auto">
      {projects?.length ? (
        <div className="space-y-2 px-2">
          {projects.map(
            project =>
              project && (
                <div key={project?.id}>

                  <SidebarItem key={project?.id} project={project}>
                    <SidebarActions
                      project={project}
                      removeProject={removeProject}
                      shareProject={shareProject}
                    />
                  </SidebarItem>
                </div>
              )
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No project history</p>
        </div>
      )}
    </div>
  )
}
