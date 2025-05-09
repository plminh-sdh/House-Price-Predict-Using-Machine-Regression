import NewUserModal from '@admin/components/NewUserModal';
import SearchBox from '@admin/components/SearchBox';
import { Badge, Button, Card, Spinner, Table } from 'react-bootstrap';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import TablePagination from '@/components/TablePagination';
import { PaginationModel } from '@/models/pagination';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import EditUserModal from '@admin/components/EditUserModal';
import {
  currentAssignedUser,
  deleteUser,
  getUsers,
} from '@admin/services/user.service';
import { UserModel } from '@admin/models/user';
import { getCompanies } from '@admin/services/company.service';
import Option from '@/models/option';
import { IdName } from '@/models/id-name';
import React from 'react';
import { useNotification } from '@/providers/NotificationProvider';
import { IconMinus } from '@tabler/icons-react';
import ErrorModal from '@/components/ErrorModal';

export type UserFilter = PaginationModel & {
  searchText?: string | undefined;
};

function UserAdmin() {
  //TODO: Might move this state to the edit component itself (like <NewProjectModal />), depending on upcoming requirements.
  const { showError, showInfo } = useNotification();

  const [filter, setFilter] = useState<UserFilter>({
    searchText: undefined,
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
  });

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [users, setUsers] = useState<UserModel[]>([]);
  const [companyOptions, setCompanyOption] = useState<Option[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deletableUserModal, setDeletableUserModal] = useState<Array<string>>(
    [],
  );

  useEffect(() => {
    getCompanies().then((data) => {
      const options = data.map((company: IdName) => {
        return {
          value: company.id,
          displayValue: company.name,
        };
      });
      setCompanyOption(options);
    });
  }, []);

  const prevFilter = JSON.stringify(filter);
  useEffect(() => {
    setLoading(true);
    const currentFilter = JSON.parse(prevFilter);
    getUsers(currentFilter)
      .then((data) => {
        setUsers(data.items);
        setFilter((prev) => ({
          ...prev,
          totalItems: data.totalCount,
          currentPage: data.pageNumber,
          pageSize: data.pageSize,
        }));
        setSelectedUserId(undefined);
      })
      .catch((error) => {
        console.log(error);
        showError(error.status, 'Failed to fetch users.');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevFilter, refresh]);

  const handleCheckboxChange = useCallback((isChecked: boolean, id: string) => {
    setSelectedUserId(isChecked ? id : undefined);
  }, []);

  const handleDeleteUser = useCallback(() => {
    if (!selectedUserId) return;

    deleteUser(selectedUserId)
      .then(() => {
        setSelectedUserId(undefined);
        setRefresh((prev) => !prev);
        setShowDeleteModal(false);
        showInfo('User deleted successfully.', 'success', 3000);
      })
      .catch((error) => {
        console.log(error);
        showError(error.status, 'Failed to delete user.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  const handlePageChange = useCallback((page: number) => {
    setFilter((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const handleSearch = useCallback((text: string | undefined) => {
    setFilter((prev) => ({ ...prev, currentPage: 1, searchText: text }));
  }, []);

  const deleteUserOnClick = useCallback(() => {
    if (!selectedUserId) return;

    currentAssignedUser(selectedUserId)
      .then(() => setShowDeleteModal(true))
      .catch((err) => {
        console.log(err);
        const data = err.data;
        setDeletableUserModal(data);
      });
  }, [selectedUserId]);

  const preventDeleteUserMessage = useMemo(() => {
    if (deletableUserModal.length === 0) return '';

    const ids = deletableUserModal.join(', ');
    return `Unable to delete this user, because User is currently assigned to comment: <strong>${ids}</strong>.`;
  }, [deletableUserModal]);

  return (
    <React.Fragment>
      <div className="m-5">
        <div className="d-flex justify-content-between mb-5">
          <div className="d-flex gap-3">
            <NewUserModal
              companyOptions={companyOptions}
              setRefresh={() => setRefresh((prev) => !prev)}
            />

            <EditUserModal
              userId={selectedUserId!}
              showModal={showEditModal}
              setShowModal={setShowEditModal}
              companyOptions={companyOptions}
              setRefresh={() => setRefresh((prev) => !prev)}
            />
          </div>

          <SearchBox onSearchDispatch={handleSearch} />
        </div>
        <Card>
          <Table className="mb-0">
            <thead>
              <tr>
                <th />
                <th>Full Name</th>
                <th>Company</th>
                <th>Email Address</th>
                <th>User Group</th>
                <th>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                !loading &&
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <FormCheckInput
                        type="checkbox"
                        className="small-checkbox"
                        checked={selectedUserId === user.id}
                        onChange={(e) =>
                          handleCheckboxChange(e.target.checked, user.id)
                        }
                      />
                    </td>
                    <td>{user.fullName}</td>
                    <td>{user.companyName}</td>
                    <td>{user.email}</td>
                    <td>{user.groupNames ? user.groupNames.join(', ') : ''}</td>
                    <td>
                      <Badge
                        bg={user.active ? 'success' : 'danger'}
                        className="me-2"
                      />
                      {user.active ? 'Enabled' : 'Disabled'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          {loading ? (
            <div className="my-2 d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : users.length === 0 ? (
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
            onClick={deleteUserOnClick}
            disabled={!selectedUserId}
            className="mt-5 ms-auto"
          >
            <IconMinus size={20} className="me-2" />
            Delete User
          </Button>
        </div>
      </div>

      {deletableUserModal.length > 0 && (
        <ErrorModal
          title="Cannot delete user"
          content={preventDeleteUserMessage}
          action={'OK'}
          showModal={deletableUserModal.length !== 0}
          handleCloseModal={() => setDeletableUserModal([])}
          size="lg"
        />
      )}

      <ConfirmModal
        isShow={showDeleteModal}
        confirmAction={handleDeleteUser}
        declineAction={() => setShowDeleteModal(false)}
        description="Are you sure you want to delete this user?"
      />
    </React.Fragment>
  );
}

export default UserAdmin;
