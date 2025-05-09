import TablePagination from "@/components/TablePagination";
import { PaginationModel } from "@/models/pagination";
import ProjectModal from "@admin/components/ProjectModal";
import SearchBox from "@admin/components/SearchBox";
import { SortableWrapper, SortChevron } from "@/styles/common";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Spinner, Table } from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { getProjects } from "@admin/services/project.service";
import { SortItemModel } from "@admin/models/sort-item";
import {
  ProjectColumnHeader,
  ProjectColumnHeaderDisplayNames,
} from "@admin/enums/project-column-headers";
import { TableColumnHeaderModel } from "@admin/models/table-column-header";
import {
  PaginatedProjectListViewModel,
  ProjectViewModel,
} from "@admin/models/project";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useNotification } from "@/providers/NotificationProvider";

function ProjectAdmin() {
  const { showError } = useNotification();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortItem, setSortItem] = useState<SortItemModel>({
    sortField: ProjectColumnHeader.Id,
    sortOrder: "ASC",
  });

  const [projects, setProjects] = useState<ProjectViewModel[]>([]);

  const [pagination, setPagination] = useState<PaginationModel>({
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
  });

  const [search, setSearch] = useState<string | undefined>();

  const [showFooter, setShowFooter] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectViewModel>();

  const fetchProjects = useCallback(() => {
    setIsLoading(true);
    getProjects(
      sortItem.sortField,
      sortItem.sortOrder,
      pagination?.currentPage,
      pagination?.pageSize,
      search
    )
      .then((paginatedProjectList: PaginatedProjectListViewModel) => {
        setProjects(paginatedProjectList.items);
        if (pagination.totalItems !== paginatedProjectList.totalCount) {
          setPagination({
            ...pagination,
            totalItems: paginatedProjectList.totalCount,
          });
        }
        setShowFooter(paginatedProjectList.totalPages > 1);
        setSelectedProject(undefined);
      })
      .catch((error) => {
        console.error(error);
        showError(error.status, "Failed to fetch projects.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sortItem, pagination, search]);

  useEffect(() => {
    fetchProjects();
  }, [sortItem, pagination, search]);

  const handleSetSortItem = (sortField: string) => {
    const sortOrder =
      sortField == sortItem.sortField && sortItem.sortOrder === "ASC"
        ? "DESC"
        : "ASC";
    setSortItem({
      sortField,
      sortOrder,
    });
  };

  return (
		<div className="m-5">
			<div className="d-flex justify-content-between mb-5">
				<div className="d-flex justify-content-start gap-3 w-100">
					<Button
						style={{ width: "150px" }}
						variant="primary"
						onClick={() => {
							setIsEditing(false);
							setShowModal(true);
						}}
					>
						<IconPlus size={20} className="me-2" />
						New Project
					</Button>
					<Button
						style={{ width: "150px" }}
						variant="primary"
						onClick={() => {
							setIsEditing(true);
							setShowModal(true);
						}}
						disabled={!selectedProject}
					>
						<IconEdit size={20} className="me-2" />
						Edit Project
					</Button>
				</div>
				<SearchBox
					onSearchDispatch={(search: string) => {
						setSearch(search);
					}}
				/>
			</div>
			<Card>
				<Table className="mb-0">
					<thead>
						<tr>
							<th></th>
							{ProjectColumnHeaderDisplayNames.map(
								(item: TableColumnHeaderModel) => {
									return (
										<th key={item.key}>
											<SortableWrapper
												onClick={() => handleSetSortItem(item.sortKey)}
											>
												{item.value}
												<SortChevron
													$show={sortItem.sortField == item.sortKey}
													$desc={sortItem.sortOrder == "DESC"}
													size={12}
													className="ms-1"
												/>
											</SortableWrapper>
										</th>
									);
								}
							)}
						</tr>
					</thead>
					<tbody>
						{!isLoading &&
							projects.map((project: ProjectViewModel) => {
								return (
									<tr key={project.id}>
										<td>
											<FormCheckInput
												type="checkbox"
												className="small-checkbox"
												onChange={() => {
													if (selectedProject !== project) {
														setSelectedProject(project);
													} else {
														setSelectedProject(undefined);
													}
												}}
												checked={selectedProject === project}
											/>
										</td>
										{ProjectColumnHeaderDisplayNames.map(
											(item: TableColumnHeaderModel) => {
												return (
													<td key={`${item.key}-${project.id}`}>
														{project[item.key as keyof ProjectViewModel]}
													</td>
												);
											}
										)}
									</tr>
								);
							})}
					</tbody>
				</Table>
				{isLoading && (
					<div className="my-2 d-flex justify-content-center">
						<Spinner animation="border" variant="primary" />
					</div>
				)}
				{!isLoading && projects.length < 1 && (
					<div className="my-2 d-flex justify-content-center">
						<span>No results found.</span>
					</div>
				)}
				{showFooter && (
					<Card.Footer className="d-flex justify-content-end py-2 border-top-0">
						{!!pagination && (
							<TablePagination
								totalItems={pagination.totalItems}
								currentPage={pagination.currentPage}
								pageSize={pagination.pageSize}
								pageChanged={(page: number) =>
									setPagination({ ...pagination, currentPage: page })
								}
							/>
						)}
					</Card.Footer>
				)}
			</Card>
			{showModal && (
				<ProjectModal
					setShowModal={setShowModal}
					isEditing={isEditing}
					selectedProject={selectedProject}
					fetchProjects={fetchProjects}
				/>
			)}
		</div>
	);
}

export default ProjectAdmin;
