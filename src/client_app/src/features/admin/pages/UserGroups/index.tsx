import ConfirmModal from '@/components/ConfirmModal';
import ErrorModal from '@/components/ErrorModal';
import TablePagination from '@/components/TablePagination';
import { GroupTypeDisplay } from '@/enums/group-type';
import { getEnumValue } from '@/helpers/find-enum-value';
import { Filter } from '@/models/filter';
import Option from '@/models/option';
import { useNotification } from '@/providers/NotificationProvider';
import EditUserGroupModal from '@admin/components/EditUserGroupModal';
import NewUserGroupModal from '@admin/components/NewUserGroupModal';
import SearchBox from '@admin/components/SearchBox';
import { GroupModel, PaginatedGroupModel } from '@admin/models/group';
import { getCompanies } from '@admin/services/company.service';
import {
  currentAssignedGroup,
  deleteGroup,
  getGroups,
} from '@admin/services/group.service';
import { IconEdit, IconMinus, IconPlus } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Table, Badge, Button, Spinner } from 'react-bootstrap';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';

function UserGroups() {
  const { showError, showInfo } = useNotification();
  const [loading, setLoading] = useState<boolean>(false);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deletableGroupModal, setDeletableGroupModal] = useState<
    | {
        currentAllocators: [];
        commentIds: [];
      }
    | undefined
  >();

  const [companyOptions, setCompanyOptions] = useState<Option[]>([]);

  const [groups, setGroups] = useState<GroupModel[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const [filter, setFilter] = useState<Filter>({
    searchText: '',
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
  });

  const fetchGroups = useCallback(() => {
    setLoading(true);
    getGroups(filter.currentPage, filter.pageSize, filter.searchText)
      .then((data: PaginatedGroupModel) => {
        setGroups(data.items);
        setFilter({
          ...filter,
          totalItems: data.totalCount,
        });
      })
      .catch((error) => {
        console.log(error);
        showError(error.status, 'Failed to fetch users.');
      })
      .finally(() => setLoading(false));
  }, [filter.currentPage, filter.pageSize, filter.searchText]);

  useEffect(() => {
    getCompanies().then((data) => {
      const options = data.map((company: any) => {
        return {
          value: company.id,
          displayValue: company.name,
        };
      });
      setCompanyOptions(options);
    });
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [filter.currentPage, filter.searchText]);

  const handlePageChange = useCallback((page: number) => {
    setFilter((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const handleSearchChange = useCallback((text: string | undefined) => {
    setFilter((prev) => ({
      ...prev,
      currentPage: 1,
      searchText: text ? text : '',
    }));
  }, []);

  const handleDeleteGroup = useCallback(() => {
    if (!selectedGroupId) return;

    deleteGroup(selectedGroupId)
      .then(() => {
        setSelectedGroupId('');
        fetchGroups();
        setShowDeleteModal(false);
        showInfo('User Group deleted successfully.', 'success', 3000);
      })
      .catch((error) => {
        console.log(error);
        showError(error.status, 'Failed to delete Group.');
      });
  }, [selectedGroupId]);

  const deleteGroupOnClick = useCallback(() => {
    if (!selectedGroupId) return;

    currentAssignedGroup(selectedGroupId)
      .then(() => setShowDeleteModal(true))
      .catch((err) => {
        console.log(err);
        const data = err.data;
        setDeletableGroupModal({
          currentAllocators: data.currentAllocators,
          commentIds: data.commentIds,
        });
      });
  }, [selectedGroupId]);

  const preventDeleteGroupMessage = useMemo(() => {
    if (!deletableGroupModal) return '';

    const users = deletableGroupModal.currentAllocators.join(', ');
    const ids = deletableGroupModal.commentIds.join(', ');
    return `Unable to delete this user group, because User: <strong>${users}</strong> is currently assigned to comment: <strong>${ids}</strong>.`;
  }, [deletableGroupModal]);

  return (
    <>
      <div className="m-5">
        <div className="d-flex justify-content-between mb-5">
          <div className="d-flex gap-3">
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <IconPlus size={20} className="me-2" />
              New Group
            </Button>
            {showAddModal && (
              <NewUserGroupModal
                showModal={showAddModal}
                setShowModal={setShowAddModal}
                companyOptions={companyOptions}
                fetchGroups={fetchGroups}
                resetSelectedGroupId={() => setSelectedGroupId('')}
              />
            )}
            <Button
              variant="primary"
              onClick={() => setShowEditModal(true)}
              disabled={!selectedGroupId}
            >
              <IconEdit size={20} className="me-2" />
              Edit Group
            </Button>
          </div>

          <SearchBox onSearchDispatch={handleSearchChange} />
        </div>
        <Card>
          <Table className="mb-0">
            <thead>
              <tr>
                <th></th>
                <th>User Group Name</th>
                <th>User Group Type</th>
                <th>Deadline (days)</th>
                <th>Company</th>
                <th>Group Status</th>
              </tr>
            </thead>
            <tbody>
              {groups &&
                !loading &&
                groups.map((group: GroupModel) => {
                  return (
                    <tr key={group.id}>
                      <td>
                        <FormCheckInput
                          type="checkbox"
                          className="small-checkbox"
                          checked={selectedGroupId === group.id}
                          onChange={(e) => {
                            setSelectedGroupId(
                              e.target.checked ? group.id : '',
                            );
                          }}
                        />
                      </td>
                      <td>{group.name}</td>
                      <td>{getEnumValue(GroupTypeDisplay, group.type)}</td>
                      <td>{group.dueDays}</td>
                      <td>
                        {group.companyNames?.length
                          ? group.companyNames.join(', ')
                          : ''}
                      </td>
                      <td>
                        {group.active ? (
                          <>
                            <Badge bg="success" className="me-2" />
                            Enabled
                          </>
                        ) : (
                          <td>
                            <Badge bg="danger" className="me-2" />
                            Disabled
                          </td>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          {loading ? (
            <div className="my-2 d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : groups.length === 0 ? (
            <div className="my-2 d-flex justify-content-center">
              <span>No results found.</span>
            </div>
          ) : (
            <Card.Footer className="d-flex justify-content-end py-2 border-top-0">
              {!!filter && (
                <TablePagination
                  totalItems={filter.totalItems}
                  currentPage={filter.currentPage}
                  pageSize={filter.pageSize}
                  pageChanged={handlePageChange}
                />
              )}
            </Card.Footer>
          )}
        </Card>

        <div className="d-flex">
          <Button
            variant="danger"
            onClick={deleteGroupOnClick}
            disabled={!selectedGroupId}
            className="mt-5 ms-auto"
          >
            <IconMinus size={20} className="me-2" />
            Delete Group
          </Button>
        </div>
      </div>
      {showDeleteModal && (
        <ConfirmModal
          isShow={showDeleteModal}
          confirmAction={handleDeleteGroup}
          declineAction={() => setShowDeleteModal(false)}
          description="Are you sure you want to delete this group?"
        />
      )}

      {deletableGroupModal && (
        <ErrorModal
          title="Cannot delete user group"
          content={preventDeleteGroupMessage}
          action={'OK'}
          showModal={deletableGroupModal !== undefined}
          handleCloseModal={() => setDeletableGroupModal(undefined)}
          size="lg"
        />
      )}

      {showEditModal && (
        <EditUserGroupModal
          groupId={selectedGroupId}
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          companyOptions={companyOptions}
          fetchGroups={fetchGroups}
          resetSelectedGroupId={() => setSelectedGroupId('')}
        />
      )}
    </>
  );
}

export default UserGroups;
